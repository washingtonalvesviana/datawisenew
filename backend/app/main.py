from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.services import mount_services

app = FastAPI(title="DataWise API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(mount_services(), prefix=settings.API_PREFIX)

@app.get("/ping")
def ping():
    return {"status": "ok"}
