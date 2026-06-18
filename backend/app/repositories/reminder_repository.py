from sqlalchemy.orm import Session

from app.models.reminder_log_model import ReminderLog
from app.models.session_model import Session as SessionModel


def list_today_sessions(
    db: Session,
    user_id: str,
    today: str
):
    return db.query(SessionModel).filter(
        SessionModel.user_id == user_id,
        SessionModel.data == today,
        SessionModel.status == "agendado"
    ).order_by(
        SessionModel.horario
    ).all()


def get_session_by_id_and_user(
    db: Session,
    session_id: str,
    user_id: str
):
    return db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.user_id == user_id
    ).first()


def create_reminder_log(
    db: Session,
    session_id: str,
    user_id: str,
    canal: str,
    destinatario: str,
    status: str,
    sent_at: str | None = None,
    error_message: str | None = None
):
    log = ReminderLog(
        session_id=session_id,
        user_id=user_id,
        canal=canal,
        destinatario=destinatario,
        status=status,
        sent_at=sent_at,
        error_message=error_message
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


def list_reminder_logs_by_user(
    db: Session,
    user_id: str
):
    return db.query(ReminderLog).filter(
        ReminderLog.user_id == user_id
    ).order_by(
        ReminderLog.sent_at.desc()
    ).all()
    
    
    