"""Shared dependencies for API route handlers."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import decode_access_token
from app.db import repositories

security = HTTPBearer(auto_error=False)


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> str:
    """Extract and validate the user_id (sub) directly from the JWT.
    
    Fast check that skips MongoDB lookups when only the user ID is needed.
    """
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_access_token(credentials.credentials)
        user_id: str | None = payload.get("sub")
        if not user_id:
            raise ValueError("Invalid token payload")
        return user_id
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    user_id: str = Depends(get_current_user_id),
) -> dict:
    """Fetch the full user document from MongoDB using the verified user_id."""
    user = await repositories.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> dict | None:
    """Extract full user dict if token is provided, otherwise return None."""
    if credentials is None or not credentials.credentials:
        return None
    try:
        payload = decode_access_token(credentials.credentials)
        user_id = payload.get("sub")
        if not user_id:
            return None
        return await repositories.get_user_by_id(user_id)
    except Exception:
        return None