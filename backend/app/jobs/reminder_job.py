from datetime import datetime

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.user_model import User
from app.services.reminder_service import (
    process_automatic_reminders_for_user,
)


def process_daily_reminders():
    print(
        "[REMINDER_JOB] Iniciando varredura:",
        datetime.now().isoformat()
    )

    db: Session = SessionLocal()

    try:
        users = db.query(User).all()

        for user in users:
            process_automatic_reminders_for_user(
                db=db,
                user=user
            )

    except Exception as error:
        print("[REMINDER_JOB][ERROR]", str(error))

    finally:
        db.close()
        
        
        