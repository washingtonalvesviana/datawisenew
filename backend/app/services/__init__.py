from importlib import import_module
from fastapi import APIRouter

def mount_services() -> APIRouter:
    router = APIRouter()
    modules = [    'data_query',
    'lgpd_query',
    'dpo_query',
    'legal_query',
    'db_manage',
    'data_migrate',
    'easy_api',
    'app_gen',]
    for m in modules:
        mod = import_module(f"app.services.{m}.api")
        router.include_router(mod.router)
    return router
