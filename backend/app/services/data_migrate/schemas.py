from pydantic import BaseModel

class DataMigrateItemCreate(BaseModel):
    name: str
    data: str | None = None
