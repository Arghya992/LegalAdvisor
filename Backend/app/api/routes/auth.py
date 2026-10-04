"""Authentication routes — /api/auth/login, /api/auth/register."""

from fastapi import APIRouter, HTTPException, status

from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.services.auth_service import login_user, register_user

print("AUTH ROUTE LOADED FROM:", __file__)

router = APIRouter(tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    try:
        return await login_user(req.email, req.password)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        )


@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest):
    print("REGISTER ENDPOINT HIT")

    try:
        print(
            "DEBUG PASSWORD:",
            repr(req.password),
            "BYTES:",
            len(req.password.encode("utf-8")),
        )

        return await register_user(
            req.email,
            req.password,
            req.name,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        )