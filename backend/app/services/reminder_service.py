from datetime import date
from datetime import datetime
from datetime import timedelta

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.reminder_repository import create_reminder_log
from app.repositories.reminder_repository import get_session_by_id_and_user
from app.repositories.reminder_repository import list_reminder_logs_by_user
from app.repositories.reminder_repository import list_today_sessions
from app.repositories.reminder_repository import reminder_log_exists
from app.services.email_service import send_email


AUTOMATIC_OFFSETS_MINUTES = [60, 15]
REMINDER_WINDOW_MINUTES = 2


def get_today_reminders(
    db: Session,
    user_id: str
):
    today = date.today().isoformat()

    return list_today_sessions(
        db,
        user_id,
        today
    )


def build_session_datetime(session):
    return datetime.fromisoformat(
        f"{session.data}T{session.horario}:00"
    )


def get_offset_label(reminder_offset_minutes: int | None):
    if reminder_offset_minutes == 60:
        return "1 hora antes"

    if reminder_offset_minutes == 15:
        return "15 minutos antes"

    return "manual"


def create_session_log(
    db: Session,
    session,
    user,
    canal: str,
    destinatario: str,
    status: str,
    tipo: str,
    reminder_offset_minutes: int | None = None,
    sent_at: str | None = None,
    error_message: str | None = None
):
    return create_reminder_log(
        db=db,
        session_id=session.id,
        user_id=user.id,
        cliente_nome=session.cliente_nome,
        cliente_email=session.cliente_email,
        servico=session.servico,
        data=session.data,
        horario=session.horario,
        canal=canal,
        destinatario=destinatario,
        tipo=tipo,
        reminder_offset_minutes=reminder_offset_minutes,
        status=status,
        sent_at=sent_at,
        error_message=error_message
    )


def send_session_reminder(
    db: Session,
    user,
    session_id: str,
    tipo: str = "manual",
    reminder_offset_minutes: int | None = None
):
    session = get_session_by_id_and_user(
        db,
        session_id,
        user.id
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Sessão não encontrada."
        )

    sent_at = datetime.now().isoformat()
    offset_label = get_offset_label(reminder_offset_minutes)

    if (
        tipo == "automatico"
        and reminder_offset_minutes is not None
        and reminder_log_exists(
            db=db,
            session_id=session.id,
            user_id=user.id,
            canal="email_cliente",
            tipo="automatico",
            reminder_offset_minutes=reminder_offset_minutes
        )
    ):
        return {
            "status": "skipped",
            "reason": "automatic_reminder_already_sent",
            "session_id": session.id,
            "reminder_offset_minutes": reminder_offset_minutes
        }

    if session.cliente_email:
        try:
            client_message = (
                f"Olá {session.cliente_nome}, passando para lembrar "
                f"do seu atendimento hoje às {session.horario}. "
                "Qualquer dúvida, estamos à disposição."
            )

            send_email(
                to_email=session.cliente_email,
                subject="Lembrete de atendimento",
                message=client_message
            )

            create_session_log(
                db=db,
                session=session,
                user=user,
                canal="email_cliente",
                destinatario=session.cliente_email,
                status="sent",
                tipo=tipo,
                reminder_offset_minutes=reminder_offset_minutes,
                sent_at=sent_at
            )

        except Exception as error:
            create_session_log(
                db=db,
                session=session,
                user=user,
                canal="email_cliente",
                destinatario=session.cliente_email,
                status="error",
                tipo=tipo,
                reminder_offset_minutes=reminder_offset_minutes,
                sent_at=sent_at,
                error_message=str(error)
            )

    if user.email:
        try:
            user_message = (
                "Confirmação de lembrete enviado.\n\n"
                f"Cliente: {session.cliente_nome}\n"
                f"Horário: {session.horario}\n"
                f"Serviço: {session.servico}\n"
                f"Tipo: {offset_label}\n\n"
                "O Lumina registrou esta tentativa no histórico."
            )

            send_email(
                to_email=user.email,
                subject="Confirmação de envio de lembrete",
                message=user_message
            )

            create_session_log(
                db=db,
                session=session,
                user=user,
                canal="email_usuario",
                destinatario=user.email,
                status="sent",
                tipo=tipo,
                reminder_offset_minutes=reminder_offset_minutes,
                sent_at=sent_at
            )

        except Exception as error:
            create_session_log(
                db=db,
                session=session,
                user=user,
                canal="email_usuario",
                destinatario=user.email,
                status="error",
                tipo=tipo,
                reminder_offset_minutes=reminder_offset_minutes,
                sent_at=sent_at,
                error_message=str(error)
            )

    return {
        "status": "processed",
        "session_id": session.id,
        "tipo": tipo,
        "reminder_offset_minutes": reminder_offset_minutes
    }


def process_automatic_reminders_for_user(
    db: Session,
    user,
    now: datetime | None = None
):
    current_time = now or datetime.now()
    today = current_time.date().isoformat()

    sessions = list_today_sessions(
        db=db,
        user_id=user.id,
        today=today
    )

    processed = []

    for session in sessions:
        session_datetime = build_session_datetime(session)

        for offset_minutes in AUTOMATIC_OFFSETS_MINUTES:
            reminder_time = session_datetime - timedelta(
                minutes=offset_minutes
            )

            window_start = reminder_time
            window_end = reminder_time + timedelta(
                minutes=REMINDER_WINDOW_MINUTES
            )

            if not (
                window_start <= current_time <= window_end
            ):
                continue

            result = send_session_reminder(
                db=db,
                user=user,
                session_id=session.id,
                tipo="automatico",
                reminder_offset_minutes=offset_minutes
            )

            processed.append(result)

    return processed


def get_reminder_logs(
    db: Session,
    user_id: str
):
    return list_reminder_logs_by_user(
        db,
        user_id
    )
    
    
    