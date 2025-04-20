from pydantic import BaseModel

class EasyApiItemCreate(BaseModel):
    name: str
    data: str | None = None
