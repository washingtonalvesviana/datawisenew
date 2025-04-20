from sqlmodel import Session
from .models import DataMigrateItem
from .schemas import DataMigrateItemCreate

def create(item: DataMigrateItemCreate, tenant_id: str, db: Session):
    obj = DataMigrateItem(**item.dict(), tenant_id=tenant_id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
