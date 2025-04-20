from sqlmodel import Session
from .models import DataQueryItem
from .schemas import DataQueryItemCreate

def create(item: DataQueryItemCreate, tenant_id: str, db: Session):
    obj = DataQueryItem(**item.dict(), tenant_id=tenant_id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
