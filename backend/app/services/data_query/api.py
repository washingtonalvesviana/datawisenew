from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.core.dependencies import get_session
from .crud import create
from .schemas import DataQueryItemCreate
from .models import DataQueryItem

router = APIRouter(prefix="/data-query", tags=["data_query"])

@router.post("/", response_model=DataQueryItem)
def new_item(payload: DataQueryItemCreate, db: Session = Depends(get_session)):
    # TODO: get tenant_id from auth context
    return create(payload, tenant_id="dummy-tenant", db=db)
