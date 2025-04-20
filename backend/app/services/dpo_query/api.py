from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.core.dependencies import get_session
from .crud import create
from .schemas import DpoQueryItemCreate
from .models import DpoQueryItem

router = APIRouter(prefix="/dpo-query", tags=["dpo_query"])

@router.post("/", response_model=DpoQueryItem)
def new_item(payload: DpoQueryItemCreate, db: Session = Depends(get_session)):
    # TODO: get tenant_id from auth context
    return create(payload, tenant_id="dummy-tenant", db=db)
