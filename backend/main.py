"""FastAPI application for the Travel Agent AI backend."""

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from agent import generate_travel_plan
from auth import get_current_user, login_user, signup_user
from config import settings
from database import create_user_record, get_user_conversations, save_conversation
from models import (
    AuthResponse,
    ConversationHistory,
    ErrorResponse,
    HealthResponse,
    HistoryResponse,
    LoginRequest,
    SignupRequest,
    Source,
    TravelPlanResponse,
    TravelQueryRequest,
)

app = FastAPI(
    title="Travel Agent AI API",
    description="AI-powered travel planning assistant using Gemini and Tavily",
    version="1.0.0",
)

# CORS middleware to allow Streamlit frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8501",
        "http://127.0.0.1:8501",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    """Validate configuration on application startup."""
    settings.validate()


@app.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Check if the API service is running.",
)
async def health_check() -> HealthResponse:
    """Return the health status of the API.

    Returns:
        HealthResponse: Service health status and version.
    """
    return HealthResponse(status="healthy", version="1.0.0")


@app.post(
    "/auth/signup",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create a new user account using Supabase Auth.",
    responses={400: {"model": ErrorResponse}},
)
def signup(request: SignupRequest) -> AuthResponse:
    """Register a new user with Supabase Auth and create a users table entry.

    Args:
        request: Signup request containing email and password.

    Returns:
        AuthResponse: Authentication tokens and user info.

    Raises:
        HTTPException: If registration fails.
    """
    # Register with Supabase Auth
    auth_result = signup_user(request.email, request.password)

    # Create entry in users table
    try:
        create_user_record(auth_result["user_id"], auth_result["email"])
    except Exception:
        # User record creation in the table might fail if RLS or triggers
        # handle it automatically; log but don't fail the signup
        pass

    return AuthResponse(
        access_token=auth_result["access_token"],
        token_type="bearer",
        user_id=auth_result["user_id"],
        email=auth_result["email"],
    )


@app.post(
    "/auth/login",
    response_model=AuthResponse,
    summary="Login user",
    description="Authenticate a user and return a JWT token.",
    responses={401: {"model": ErrorResponse}},
)
def login(request: LoginRequest) -> AuthResponse:
    """Authenticate an existing user and return JWT token.

    Args:
        request: Login request containing email and password.

    Returns:
        AuthResponse: Authentication tokens and user info.

    Raises:
        HTTPException: If authentication fails.
    """
    auth_result = login_user(request.email, request.password)

    return AuthResponse(
        access_token=auth_result["access_token"],
        token_type="bearer",
        user_id=auth_result["user_id"],
        email=auth_result["email"],
    )


@app.post(
    "/travel/plan",
    response_model=TravelPlanResponse,
    summary="Generate a travel plan",
    description="Use AI to generate a comprehensive travel plan based on the user's query.",
    responses={401: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
)
def create_travel_plan(
    request: TravelQueryRequest,
    current_user: dict = Depends(get_current_user),
) -> TravelPlanResponse:
    """Generate a travel plan using Gemini AI and Tavily search.

    The endpoint:
    1. Accepts a travel query from the authenticated user
    2. Uses Tavily to search for real-time travel information
    3. Passes search results + query to Gemini AI
    4. Saves the conversation to the database
    5. Returns the structured travel plan

    Args:
        request: Travel query request.
        current_user: Authenticated user info from JWT token.

    Returns:
        TravelPlanResponse: The generated travel plan with metadata.

    Raises:
        HTTPException: If plan generation or saving fails.
    """
    try:
        # Generate the travel plan using AI
        plan, raw_sources = generate_travel_plan(request.query)

        # Save the conversation to the database
        conversation = save_conversation(
            user_id=current_user["user_id"],
            query=request.query,
            response=plan,
            sources=raw_sources,
        )

        sources = [Source(title=s["title"], url=s["url"]) for s in raw_sources]

        return TravelPlanResponse(
            conversation_id=conversation.get("id", ""),
            query=request.query,
            plan=plan,
            sources=sources,
            created_at=conversation.get("created_at", ""),
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate travel plan: {str(e)}",
        )


@app.get(
    "/travel/history",
    response_model=HistoryResponse,
    summary="Get conversation history",
    description="Retrieve the authenticated user's past travel plan conversations.",
    responses={401: {"model": ErrorResponse}},
)
def get_travel_history(
    current_user: dict = Depends(get_current_user),
) -> HistoryResponse:
    """Get the conversation history for the authenticated user.

    Args:
        current_user: Authenticated user info from JWT token.

    Returns:
        HistoryResponse: List of past conversations.

    Raises:
        HTTPException: If fetching history fails.
    """
    try:
        conversations = get_user_conversations(current_user["user_id"])
        return HistoryResponse(
            conversations=[
                ConversationHistory(
                    id=conv["id"],
                    query=conv["query"],
                    response=conv["response"],
                    sources=[
                        Source(title=s["title"], url=s["url"])
                        for s in (conv.get("sources") or [])
                    ],
                    created_at=conv["created_at"],
                )
                for conv in conversations
            ]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch conversation history: {str(e)}",
        )
