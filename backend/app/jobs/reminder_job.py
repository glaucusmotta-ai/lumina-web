from datetime import datetime

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.user_model import User
from app.services.reminder_service import (
    process_automatic_reminders_for_user,
)


def process_daily_reminders():
    now = datetime.now()

    print(
        "[REMINDER_JOB] Iniciando varredura:",
        now.isoformat(),
        flush=True
    )

    db: Session = SessionLocal()

    try:
        users = db.query(User).all()

        print(
            "[REMINDER_JOB] Usuarios encontrados:",
            len(users),
            flush=True
        )

        total_processed = 0

        for user in users:
            print(
                "[REMINDER_JOB] Processando usuario:",
                user.id,
                getattr(user, "email", None),
                flush=True
            )

            result = process_automatic_reminders_for_user(
                db=db,
                user=user,
                now=now
            )

            total_processed += len(result)

            print(
                "[REMINDER_JOB] Resultado usuario:",
                user.id,
                result,
                flush=True
            )

        print(
            "[REMINDER_JOB] Varredura finalizada. Total processado:",
            total_processed,
            flush=True
        )

    except Exception as error:
        print(
            "[REMINDER_JOB][ERROR]",
            str(error),
            flush=True
        )

    finally:
        db.close()
        
        