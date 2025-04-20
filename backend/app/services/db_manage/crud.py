from sqlmodel import Session
from .models import DbManageItem
from .schemas import DbManageItemCreate

def create(item: DbManageItemCreate, tenant_id: str, db: Session):
    obj = DbManageItem(**item.dict(), tenant_id=tenant_id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
