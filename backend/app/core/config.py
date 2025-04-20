from typing import List
from pydantic import BaseSettings, PostgresDsn
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    API_PREFIX: str = "/api/v1"

    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.hostinger.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 465))
    SMTP_USER: str = os.getenv("SMTP_USER", "adm@datawiseservice.com")
    SMTP_PASS: str = os.getenv("SMTP_PASS", "")
    SMTP_SENDER: str = os.getenv("SMTP_SENDER", "adm@datawiseservice.com")

    CORS_ORIGINS: List[str] = [
        "https://datawisenew.datawiserservice.com",
        "https://api-datawisenew.datawiserservice.com",
    ]
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE_ME")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    DATABASE_URL: PostgresDsn = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:password@localhost:5432/datawise")
    class Config:
        case_sensitive = True

settings = Settings()