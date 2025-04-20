from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.core.dependencies import get_session
from .crud import create
from .schemas import LgpdQueryItemCreate
from .models import LgpdQueryItem

router = APIRouter(prefix="/lgpd-query", tags=["lgpd_query"])

@router.post("/", response_model=LgpdQueryItem)
def new_item(payload: LgpdQueryItemCreate, db: Session = Depends(get_session)):
    # TODO: get tenant_id from auth context
    return create(payload, tenant_id="dummy-tenant", db=db)
