from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.core.dependencies import get_session
from .crud import create
from .schemas import DbManageItemCreate
from .models import DbManageItem

router = APIRouter(prefix="/db-manage", tags=["db_manage"])

@router.post("/", response_model=DbManageItem)
def new_item(payload: DbManageItemCreate, db: Session = Depends(get_session)):
    # TODO: get tenant_id from auth context
    return create(payload, tenant_id="dummy-tenant", db=db)
