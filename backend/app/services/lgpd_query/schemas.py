from pydantic import BaseModel

class LgpdQueryItemCreate(BaseModel):
    name: str
    data: str | None = None
