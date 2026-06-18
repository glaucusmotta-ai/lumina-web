import uuid

from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import String

from app.database.database import Base


class Session(Base):
    __tablename__ = "sessions"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    user_id = Column(
        String,
        ForeignKey("users.id"),
        nullable=False
    )

    cliente_nome = Column(
        String,
        nullable=False
    )

    cliente_whatsapp = Column(
        String,
        nullable=True
    )

    cliente_email = Column(
        String,
        nullable=True
    )

    servico = Column(
        String,
        nullable=False
    )

    data = Column(
        String,
        nullable=False
    )

    horario = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="agendado"
    )
    
    
    