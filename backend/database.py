"""Database operations using Supabase."""

import logging

from supabase import create_client, Client

from config import settings

logger = logging.getLogger(__name__)


def get_supabase_client() -> Client:
    """Create and return a Supabase client using the anon key.

    Returns:
        Client: Supabase client instance.
    """
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


def get_supabase_admin_client() -> Client:
    """Create and return a Supabase client using the service role key.

    Used for admin operations like creating users in the users table.

    Returns:
        Client: Supabase admin client instance.
    """
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)


def create_user_record(user_id: str, email: str) -> dict:
    """Create a user record in the users table.

    Args:
        user_id: The user's UUID from Supabase Auth.
        email: The user's email address.

    Returns:
        dict: The created user record.

    Raises:
        Exception: If the database operation fails.
    """
    client = get_supabase_admin_client()
    result = (
        client.table("users")
        .insert({"id": user_id, "auth_id": user_id, "email": email})
        .execute()
    )
    return result.data[0] if result.data else {}


def save_conversation(
    user_id: str,
    query: str,
    response: str,
    sources: list[dict] | None = None,
) -> dict:
    """Save a conversation (travel query and AI response) to the database.

    Args:
        user_id: The authenticated user's UUID.
        query: The user's travel query.
        response: The AI-generated travel plan.
        sources: Optional list of source dicts with title and url.

    Returns:
        dict: The saved conversation record.

    Raises:
        Exception: If the database operation fails.
    """
    client = get_supabase_admin_client()

    row: dict = {
        "user_id": user_id,
        "query": query,
        "response": response,
    }

    if sources is not None:
        row["sources"] = sources

    try:
        result = client.table("conversations").insert(row).execute()
    except Exception:
        if sources is not None:
            # The sources column may not exist yet; retry without it
            logger.warning(
                "Failed to save with sources column – retrying without it. "
                "Run: ALTER TABLE conversations ADD COLUMN sources jsonb;"
            )
            row.pop("sources", None)
            result = client.table("conversations").insert(row).execute()
        else:
            raise

    return result.data[0] if result.data else {}


def get_user_conversations(user_id: str) -> list[dict]:
    """Retrieve all conversations for a given user, ordered by creation date.

    Args:
        user_id: The authenticated user's UUID.

    Returns:
        list[dict]: List of conversation records.

    Raises:
        Exception: If the database operation fails.
    """
    client = get_supabase_admin_client()
    result = (
        client.table("conversations")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data if result.data else []
