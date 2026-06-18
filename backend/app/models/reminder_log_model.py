import uuid

from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import String

from app.database.database import Base


class ReminderLog(Base):
    __tablename__ = "reminder_logs"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    session_id = Column(
        String,
        ForeignKey("sessions.id"),
        nullable=False
    )

    user_id = Column(
        String,
        ForeignKey("users.id"),
        nullable=False
    )

    canal = Column(
        String,
        nullable=False
    )

    destinatario = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        nullable=False
    )

    sent_at = Column(
        String,
        nullable=True
    )

    error_message = Column(
        String,
        nullable=True
    )
    
    
    