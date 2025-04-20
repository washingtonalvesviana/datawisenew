from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.core.dependencies import get_session
from .crud import create
from .schemas import LegalQueryItemCreate
from .models import LegalQueryItem

router = APIRouter(prefix="/legal-query", tags=["legal_query"])

@router.post("/", response_model=LegalQueryItem)
def new_item(payload: LegalQueryItemCreate, db: Session = Depends(get_session)):
    # TODO: get tenant_id from auth context
    return create(payload, tenant_id="dummy-tenant", db=db)
