"""Pydantic models for request/response validation."""


from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    """Request model for user registration."""

    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(
        ..., min_length=6, description="User's password (min 6 characters)"
    )


class LoginRequest(BaseModel):
    """Request model for user login."""

    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")


class AuthResponse(BaseModel):
    """Response model for authentication endpoints."""

    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    user_id: str = Field(..., description="User's unique identifier")
    email: str = Field(..., description="User's email address")


class TravelQueryRequest(BaseModel):
    """Request model for travel plan generation."""

    query: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        description="Travel query, e.g. 'Plan a 5 day trip to Bali on a $2000 budget'",
    )


class Source(BaseModel):
    """Model for a web source reference."""

    title: str = Field(..., description="Title of the source page")
    url: str = Field(..., description="URL of the source page")


class TravelPlanResponse(BaseModel):
    """Response model for a generated travel plan."""

    conversation_id: str = Field(..., description="Unique conversation identifier")
    query: str = Field(..., description="Original user query")
    plan: str = Field(..., description="Generated travel plan")
    sources: list[Source] = Field(default_factory=list, description="Web sources used")
    created_at: str = Field(..., description="Timestamp of plan creation")


class ConversationHistory(BaseModel):
    """Model for a single conversation history entry."""

    id: str = Field(..., description="Conversation unique identifier")
    query: str = Field(..., description="Original user query")
    response: str = Field(..., description="AI-generated travel plan")
    sources: list[Source] = Field(default_factory=list, description="Web sources used")
    created_at: str = Field(..., description="Timestamp of conversation")


class HistoryResponse(BaseModel):
    """Response model for conversation history endpoint."""

    conversations: list[ConversationHistory] = Field(
        default_factory=list, description="List of past conversations"
    )


class HealthResponse(BaseModel):
    """Response model for health check endpoint."""

    status: str = Field(default="healthy", description="Service health status")
    version: str = Field(default="1.0.0", description="API version")


class ErrorResponse(BaseModel):
    """Standard error response model."""

    detail: str = Field(..., description="Error message")
