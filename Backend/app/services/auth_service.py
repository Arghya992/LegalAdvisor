"""Authentication service — user registration, login, JWT issuance."""

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.db import repositories
from app.schemas.auth import AuthUser, TokenResponse


async def register_user(
    email: str,
    password: str,
    name: str,
) -> TokenResponse:

    print(
        "DEBUG 1 - password bytes:",
        len(password.encode("utf-8")),
    )

    existing = await repositories.get_user_by_email(email)

    if existing:
        raise ValueError("An account with this email already exists.")

    print("DEBUG 2 - before hashing")

    hashed = hash_password(password)

    print("DEBUG 3 - hashing succeeded")

    user = await repositories.create_user(
        email,
        name,
        hashed,
    )

    print("DEBUG 4 - database insert succeeded")

    token = create_access_token(
        user["id"],
        {
            "email": email,
            "name": name,
        },
    )

    print("DEBUG 5 - token created")

    return TokenResponse(
        id=user["id"],
        email=email,
        name=name,
        token=token,
    )


async def login_user(
    email: str,
    password: str,
) -> TokenResponse:

    user = await repositories.get_user_by_email(email)

    if not user:
        raise ValueError("Invalid credentials.")

    if not verify_password(
        password,
        user.get("hashed_password", ""),
    ):
        raise ValueError("Invalid credentials.")

    token = create_access_token(
        user["id"],
        {
            "email": user["email"],
            "name": user["name"],
        },
    )

    return TokenResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        token=token,
    )


async def get_user_by_id(
    user_id: str,
) -> AuthUser | None:

    user = await repositories.get_user_by_id(user_id)

    if not user:
        return None

    return AuthUser(
        id=user["id"],
        email=user["email"],
        name=user["name"],
    )