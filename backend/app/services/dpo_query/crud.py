from sqlmodel import Session
from .models import DpoQueryItem
from .schemas import DpoQueryItemCreate

def create(item: DpoQueryItemCreate, tenant_id: str, db: Session):
    obj = DpoQueryItem(**item.dict(), tenant_id=tenant_id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
