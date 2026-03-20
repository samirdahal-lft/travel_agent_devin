"""Authentication helpers using Supabase Auth."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from database import get_supabase_client

security = HTTPBearer()


def signup_user(email: str, password: str) -> dict:
    """Register a new user with Supabase Auth.

    Args:
        email: The user's email address.
        password: The user's password.

    Returns:
        dict: Auth response containing user info and session.

    Raises:
        HTTPException: If registration fails.
    """
    client = get_supabase_client()
    try:
        response = client.auth.sign_up(
            {"email": email, "password": password}
        )
        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Signup failed. User may already exist.",
            )
        return {
            "user_id": response.user.id,
            "email": response.user.email,
            "access_token": response.session.access_token
            if response.session
            else "",
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Signup failed: {str(e)}",
        )


def login_user(email: str, password: str) -> dict:
    """Authenticate an existing user with Supabase Auth.

    Args:
        email: The user's email address.
        password: The user's password.

    Returns:
        dict: Auth response containing user info and session token.

    Raises:
        HTTPException: If login fails.
    """
    client = get_supabase_client()
    try:
        response = client.auth.sign_in_with_password(
            {"email": email, "password": password}
        )
        if not response.user or not response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )
        return {
            "user_id": response.user.id,
            "email": response.user.email,
            "access_token": response.session.access_token,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login failed: {str(e)}",
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Verify JWT token and return the current authenticated user.

    This dependency is used to protect endpoints that require authentication.

    Args:
        credentials: The Bearer token from the Authorization header.

    Returns:
        dict: User info containing user_id and email.

    Raises:
        HTTPException: If token is invalid or expired.
    """
    token = credentials.credentials
    client = get_supabase_client()
    try:
        response = client.auth.get_user(token)
        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token.",
            )
        return {
            "user_id": response.user.id,
            "email": response.user.email,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}",
        )
