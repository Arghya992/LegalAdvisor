"""Legal resources routes — /api/resources.

Frontend expects:
  GET  /resources?category={cat}&q={search}  → LegalResource[]
  GET  /resources/{id}                        → LegalResource
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps import get_optional_user
from app.db import repositories
from app.models.legal_resource import seed_resources
from app.schemas.legal import LegalResource, ResourceCategory

router = APIRouter()

RESOURCE_CATEGORIES = [
    {"id": "acts", "name": "Acts & Statutes", "description": "Major legislative acts and statutes.", "count": 12},
    {"id": "constitution", "name": "Constitution", "description": "Constitutional provisions and amendments.", "count": 8},
    {"id": "procedures", "name": "Legal Procedures", "description": "Civil and criminal procedural frameworks.", "count": 10},
    {"id": "consumer", "name": "Consumer Rights", "description": "Consumer protection and dispute resolution.", "count": 6},
    {"id": "cyber", "name": "Cyber Law", "description": "Digital and information technology law.", "count": 7},
    {"id": "labour", "name": "Labour Law", "description": "Employment, wages, and workplace rights.", "count": 9},
    {"id": "civil", "name": "Civil Law", "description": "Contracts, torts, and civil disputes.", "count": 11},
    {"id": "criminal", "name": "Criminal Law", "description": "Offences, defences, and criminal procedure.", "count": 14},
    {"id": "glossary", "name": "Legal Glossary", "description": "Plain-language definitions of legal terms.", "count": 24},
    {"id": "government", "name": "Government Resources", "description": "Official portals and public legal services.", "count": 5},
]


@router.get("", response_model=list[LegalResource])
@router.get("/", response_model=list[LegalResource])
async def list_resources(
    category: str | None = Query(default=None),
    q: str | None = Query(default=None),
    _user: dict | None = Depends(get_optional_user),
):
    """List legal resources with optional category filter and text search."""
    # Ensure seed data exists on first call
    await repositories.seed_resources_if_empty(seed_resources())
    resources = await repositories.get_resources(category=category, search=q)
    return [LegalResource(**r) for r in resources]


@router.get("/categories", response_model=list[ResourceCategory])
async def list_categories(
    _user: dict | None = Depends(get_optional_user),
):
    """Return all resource categories."""
    return [ResourceCategory(**c) for c in RESOURCE_CATEGORIES]


@router.get("/{resource_id}", response_model=LegalResource)
async def get_resource(
    resource_id: str,
    _user: dict | None = Depends(get_optional_user),
):
    """Return a single legal resource by ID."""
    await repositories.seed_resources_if_empty(seed_resources())
    resource = await repositories.get_resource_by_id(resource_id)
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found",
        )
    return LegalResource(**resource)
