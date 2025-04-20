from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.core.dependencies import get_session
from .crud import create
from .schemas import DataMigrateItemCreate
from .models import DataMigrateItem

router = APIRouter(prefix="/data-migrate", tags=["data_migrate"])

@router.post("/", response_model=DataMigrateItem)
def new_item(payload: DataMigrateItemCreate, db: Session = Depends(get_session)):
    # TODO: get tenant_id from auth context
    return create(payload, tenant_id="dummy-tenant", db=db)
