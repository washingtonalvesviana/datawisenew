from pydantic import BaseModel

class DataQueryItemCreate(BaseModel):
    name: str
    data: str | None = None
