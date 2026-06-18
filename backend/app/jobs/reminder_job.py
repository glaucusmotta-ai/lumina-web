from datetime import date

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.user_model import User
from app.repositories.reminder_repository import list_today_sessions
from app.services.reminder_service import send_session_reminder


def process_daily_reminders():
    db: Session = SessionLocal()

    try:
        today = date.today().isoformat()

        users = db.query(User).all()

        for user in users:
            sessions = list_today_sessions(
                db=db,
                user_id=user.id,
                today=today
            )

            for session in sessions:
                send_session_reminder(
                    db=db,
                    user=user,
                    session_id=session.id
                )

    finally:
        db.close()
        
        
        