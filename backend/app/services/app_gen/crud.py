from sqlmodel import Session
from .models import AppGenItem
from .schemas import AppGenItemCreate

def create(item: AppGenItemCreate, tenant_id: str, db: Session):
    obj = AppGenItem(**item.dict(), tenant_id=tenant_id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
