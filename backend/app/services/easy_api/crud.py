from sqlmodel import Session
from .models import EasyApiItem
from .schemas import EasyApiItemCreate

def create(item: EasyApiItemCreate, tenant_id: str, db: Session):
    obj = EasyApiItem(**item.dict(), tenant_id=tenant_id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
