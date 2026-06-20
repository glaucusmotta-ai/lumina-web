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
        SessionModel.status.in_([
            "agendado",
            "Agendado",
            "confirmada",
            "Confirmada",
            "CONFIRMADA",
        ])
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


def reminder_log_exists(
    db: Session,
    session_id: str,
    user_id: str,
    canal: str,
    tipo: str,
    reminder_offset_minutes: int | None = None
):
    query = db.query(ReminderLog).filter(
        ReminderLog.session_id == session_id,
        ReminderLog.user_id == user_id,
        ReminderLog.canal == canal,
        ReminderLog.tipo == tipo,
    )

    if reminder_offset_minutes is not None:
        query = query.filter(
            ReminderLog.reminder_offset_minutes == str(reminder_offset_minutes)
        )

    return query.first() is not None


def create_reminder_log(
    db: Session,
    session_id: str,
    user_id: str,
    canal: str,
    destinatario: str,
    status: str,
    cliente_nome: str | None = None,
    cliente_email: str | None = None,
    servico: str | None = None,
    data: str | None = None,
    horario: str | None = None,
    tipo: str = "manual",
    reminder_offset_minutes: int | None = None,
    sent_at: str | None = None,
    error_message: str | None = None
):
    log = ReminderLog(
        session_id=session_id,
        user_id=user_id,
        cliente_nome=cliente_nome,
        cliente_email=cliente_email,
        servico=servico,
        data=data,
        horario=horario,
        canal=canal,
        destinatario=destinatario,
        tipo=tipo,
        reminder_offset_minutes=(
            str(reminder_offset_minutes)
            if reminder_offset_minutes is not None
            else None
        ),
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
    
    
    