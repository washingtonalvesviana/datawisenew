from sqlmodel import SQLModel, Field
from uuid import uuid4

class LgpdQueryItem(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    tenant_id: str = Field(foreign_key="tenant.id")
    name: str
    data: str | None = None
