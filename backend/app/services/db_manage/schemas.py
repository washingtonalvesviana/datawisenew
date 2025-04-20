from pydantic import BaseModel

class DbManageItemCreate(BaseModel):
    name: str
    data: str | None = None
