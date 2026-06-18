from datetime import date
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.reminder_repository import create_reminder_log
from app.repositories.reminder_repository import get_session_by_id_and_user
from app.repositories.reminder_repository import list_reminder_logs_by_user
from app.repositories.reminder_repository import list_today_sessions
from app.services.email_service import send_email


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


def send_session_reminder(
    db: Session,
    user
    ,
    session_id: str
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

            create_reminder_log(
                db=db,
                session_id=session.id,
                user_id=user.id,
                canal="email_cliente",
                destinatario=session.cliente_email,
                status="sent",
                sent_at=sent_at
            )

        except Exception as error:
            create_reminder_log(
                db=db,
                session_id=session.id,
                user_id=user.id,
                canal="email_cliente",
                destinatario=session.cliente_email,
                status="error",
                sent_at=sent_at,
                error_message=str(error)
            )

    if user.email:
        try:
            user_message = (
                f"Você tem atendimento hoje com {session.cliente_nome} "
                f"às {session.horario}. Serviço: {session.servico}."
            )

            send_email(
                to_email=user.email,
                subject="Resumo do atendimento de hoje",
                message=user_message
            )

            create_reminder_log(
                db=db,
                session_id=session.id,
                user_id=user.id,
                canal="email_usuario",
                destinatario=user.email,
                status="sent",
                sent_at=sent_at
            )

        except Exception as error:
            create_reminder_log(
                db=db,
                session_id=session.id,
                user_id=user.id,
                canal="email_usuario",
                destinatario=user.email,
                status="error",
                sent_at=sent_at,
                error_message=str(error)
            )

    return {
        "status": "processed",
        "session_id": session.id
    }


def get_reminder_logs(
    db: Session,
    user_id: str
):
    return list_reminder_logs_by_user(
        db,
        user_id
    )
    
    
    