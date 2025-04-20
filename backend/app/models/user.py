from sqlmodel import SQLModel, Field
from uuid import uuid4

class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    tenant_id: str = Field(foreign_key="tenant.id")
    email: str
    hashed_password: str
    role: str = "usuario"
    is_active: bool = True
