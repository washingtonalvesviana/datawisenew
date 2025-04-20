from sqlmodel import Session
from .models import LgpdQueryItem
from .schemas import LgpdQueryItemCreate

def create(item: LgpdQueryItemCreate, tenant_id: str, db: Session):
    obj = LgpdQueryItem(**item.dict(), tenant_id=tenant_id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
