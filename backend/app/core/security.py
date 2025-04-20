from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(sub: str, exp_minutes: int | None = None):
    if exp_minutes is None:
        exp_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    data = {"sub": sub, "exp": datetime.utcnow() + timedelta(minutes=exp_minutes)}
    return jwt.encode(data, settings.SECRET_KEY, "HS256")

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def hash_password(password):
    return pwd_context.hash(password)
