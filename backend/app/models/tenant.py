from sqlmodel import SQLModel, Field
from uuid import uuid4
from datetime import datetime

class Tenant(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: str
    logo_url: str | None = None
    created_at: datetime | None = None
