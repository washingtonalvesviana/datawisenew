from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.core.dependencies import get_session
from .crud import create
from .schemas import EasyApiItemCreate
from .models import EasyApiItem

router = APIRouter(prefix="/easy-api", tags=["easy_api"])

@router.post("/", response_model=EasyApiItem)
def new_item(payload: EasyApiItemCreate, db: Session = Depends(get_session)):
    # TODO: get tenant_id from auth context
    return create(payload, tenant_id="dummy-tenant", db=db)
