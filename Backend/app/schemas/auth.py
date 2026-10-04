"""Auth request/response schemas matching the frontend authService."""

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str


class AuthUser(BaseModel):
    id: str
    email: str
    name: str


class TokenResponse(AuthUser):
    token: str
