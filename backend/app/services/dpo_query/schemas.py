from pydantic import BaseModel

class DpoQueryItemCreate(BaseModel):
    name: str
    data: str | None = None
