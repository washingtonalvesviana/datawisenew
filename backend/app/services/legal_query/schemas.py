from pydantic import BaseModel

class LegalQueryItemCreate(BaseModel):
    name: str
    data: str | None = None
