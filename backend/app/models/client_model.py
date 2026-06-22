import uuid

from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import String

from app.database.database import Base


class Client(Base):
    __tablename__ = "clients"

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

    nome = Column(
        String,
        nullable=False
    )

    telefone = Column(
        String,
        nullable=True
    )

    whatsapp = Column(
        String,
        nullable=True
    )

    email = Column(
        String,
        nullable=True
    )

    observacoes = Column(
        String,
        nullable=True
    )

    origem_cliente = Column(
        String,
        nullable=True
    )

    regiao = Column(
        String,
        nullable=True
    )

    local_atendimento = Column(
        String,
        nullable=True
    )

    proxima_sessao = Column(
        String,
        nullable=True
    )

    horario_proxima_sessao = Column(
        String,
        nullable=True
    )
    
    
    