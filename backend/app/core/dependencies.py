from sqlmodel import Session, create_engine
from .config import settings
from typing import Generator

engine = create_engine(settings.DATABASE_URL, echo=False)

def get_session() -> Generator:
    with Session(engine) as session:
        yield session
