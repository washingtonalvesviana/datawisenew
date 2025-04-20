from pydantic import BaseModel

class AppGenItemCreate(BaseModel):
    name: str
    data: str | None = None
