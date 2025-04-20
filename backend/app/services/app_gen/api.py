from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.core.dependencies import get_session
from .crud import create
from .schemas import AppGenItemCreate
from .models import AppGenItem

router = APIRouter(prefix="/app-gen", tags=["app_gen"])

@router.post("/", response_model=AppGenItem)
def new_item(payload: AppGenItemCreate, db: Session = Depends(get_session)):
    # TODO: get tenant_id from auth context
    return create(payload, tenant_id="dummy-tenant", db=db)
