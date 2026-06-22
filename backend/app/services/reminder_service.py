import logging

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


logger = logging.getLogger(__name__)

AUTOMATIC_OFFSETS_MINUTES = [60, 15]
REMINDER_WINDOW_MINUTES = 2


def get_today_reminders(
    db: Session,
    user_id: str
):
    today = date.today().isoformat()

    logger.info(
        "REMINDER_TODAY_START user_id=%s today=%s",
        user_id,
        today
    )

    sessions = list_today_sessions(
        db,
        user_id,
        today
    )

    logger.info(
        "REMINDER_TODAY_RESULT user_id=%s today=%s count=%s",
        user_id,
        today,
        len(sessions)
    )

    return sessions


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
    logger.info(
        "REMINDER_LOG_CREATE session_id=%s user_id=%s canal=%s destinatario=%s status=%s tipo=%s offset=%s error=%s",
        session.id,
        user.id,
        canal,
        destinatario,
        status,
        tipo,
        reminder_offset_minutes,
        error_message
    )

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
    logger.info(
        "REMINDER_SEND_START session_id=%s user_id=%s tipo=%s offset=%s",
        session_id,
        user.id,
        tipo,
        reminder_offset_minutes
    )

    session = get_session_by_id_and_user(
        db,
        session_id,
        user.id
    )

    if not session:
        logger.warning(
            "REMINDER_SEND_SESSION_NOT_FOUND session_id=%s user_id=%s",
            session_id,
            user.id
        )

        raise HTTPException(
            status_code=404,
            detail="Sessão não encontrada."
        )

    logger.info(
        "REMINDER_SEND_SESSION_FOUND session_id=%s user_id=%s cliente=%s cliente_email_present=%s user_email_present=%s",
        session.id,
        user.id,
        session.cliente_nome,
        bool(session.cliente_email),
        bool(user.email)
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
        logger.info(
            "REMINDER_SEND_SKIPPED_ALREADY_SENT session_id=%s user_id=%s offset=%s",
            session.id,
            user.id,
            reminder_offset_minutes
        )

        return {
            "status": "skipped",
            "reason": "automatic_reminder_already_sent",
            "session_id": session.id,
            "reminder_offset_minutes": reminder_offset_minutes
        }

    if session.cliente_email:
        try:
            logger.info(
                "REMINDER_CLIENT_EMAIL_ATTEMPT session_id=%s to=%s",
                session.id,
                session.cliente_email
            )

            client_message = (
                f"Olá {session.cliente_nome}, passando para lembrar "
                f"do seu atendimento hoje às {session.horario}.\n\n"
                "Este é um e-mail automático do Lumina.\n"
                "Por favor, não responda esta mensagem.\n\n"
                "Caso precise confirmar, reagendar ou tirar dúvidas, "
                "entre em contato diretamente com seu profissional."
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

            logger.info(
                "REMINDER_CLIENT_EMAIL_SENT session_id=%s to=%s",
                session.id,
                session.cliente_email
            )

        except Exception as error:
            logger.exception(
                "REMINDER_CLIENT_EMAIL_ERROR session_id=%s to=%s error=%s",
                session.id,
                session.cliente_email,
                str(error)
            )

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
    else:
        logger.warning(
            "REMINDER_CLIENT_EMAIL_SKIPPED_NO_EMAIL session_id=%s cliente=%s",
            session.id,
            session.cliente_nome
        )

    if user.email:
        try:
            logger.info(
                "REMINDER_USER_EMAIL_ATTEMPT session_id=%s to=%s",
                session.id,
                user.email
            )

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

            logger.info(
                "REMINDER_USER_EMAIL_SENT session_id=%s to=%s",
                session.id,
                user.email
            )

        except Exception as error:
            logger.exception(
                "REMINDER_USER_EMAIL_ERROR session_id=%s to=%s error=%s",
                session.id,
                user.email,
                str(error)
            )

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
    else:
        logger.warning(
            "REMINDER_USER_EMAIL_SKIPPED_NO_EMAIL session_id=%s user_id=%s",
            session.id,
            user.id
        )

    logger.info(
        "REMINDER_SEND_DONE session_id=%s user_id=%s tipo=%s offset=%s",
        session.id,
        user.id,
        tipo,
        reminder_offset_minutes
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

    logger.info(
        "REMINDER_AUTO_SCAN_USER_START user_id=%s today=%s now=%s",
        user.id,
        today,
        current_time.isoformat()
    )

    sessions = list_today_sessions(
        db=db,
        user_id=user.id,
        today=today
    )

    logger.info(
        "REMINDER_AUTO_SCAN_USER_SESSIONS user_id=%s count=%s",
        user.id,
        len(sessions)
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

            logger.info(
                "REMINDER_AUTO_CHECK session_id=%s offset=%s now=%s window_start=%s window_end=%s",
                session.id,
                offset_minutes,
                current_time.isoformat(),
                window_start.isoformat(),
                window_end.isoformat()
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

    logger.info(
        "REMINDER_AUTO_SCAN_USER_DONE user_id=%s processed=%s",
        user.id,
        len(processed)
    )

    return processed


def get_reminder_logs(
    db: Session,
    user_id: str
):
    return list_reminder_logs_by_user(
        db,
        user_id
    )
    
    
    