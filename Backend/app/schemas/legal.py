"""Legal resource schemas matching the frontend types."""

from pydantic import BaseModel


class ResourceMetadata(BaseModel):
    jurisdiction: str | None = None
    year: str | None = None
    authority: str | None = None


class LegalResource(BaseModel):
    id: str
    title: str
    category: str
    type: str
    description: str
    isDemo: bool = True
    metadata: ResourceMetadata = ResourceMetadata()


class ResourceCategory(BaseModel):
    id: str
    name: str
    description: str
    count: int
