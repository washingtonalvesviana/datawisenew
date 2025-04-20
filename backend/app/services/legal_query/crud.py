from sqlmodel import Session
from .models import LegalQueryItem
from .schemas import LegalQueryItemCreate

def create(item: LegalQueryItemCreate, tenant_id: str, db: Session):
    obj = LegalQueryItem(**item.dict(), tenant_id=tenant_id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
