import uuid

from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import DateTime
from datetime import datetime, timedelta

from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    documento = Column(String, nullable=True)
    telefone = Column(String, nullable=True)
    plano = Column(String, default="trial")
    trial_status = Column(String, default="active")
    trial_expires_at = Column(DateTime, nullable=True, default=lambda: datetime.utcnow() + timedelta(days=14))
    password_hash = Column(String, nullable=False)
    
    