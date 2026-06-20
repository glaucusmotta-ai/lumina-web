from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.schemas.reminder_schema import ReminderLogResponseSchema
from app.schemas.reminder_schema import ReminderSendSchema
from app.schemas.reminder_schema import ReminderTodaySchema
from app.services.reminder_service import get_reminder_logs
from app.services.reminder_service import get_today_reminders
from app.services.reminder_service import send_session_reminder

router = APIRouter(
    prefix="/reminders",
    tags=["Reminders"]
)


@router.get(
    "/today",
    response_model=list[ReminderTodaySchema]
)
def today(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_today_reminders(
        db,
        current_user.id
    )


@router.post("/send")
def send(
    reminder_data: ReminderSendSchema,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return send_session_reminder(
        db,
        current_user,
        reminder_data.session_id
    )


@router.get(
    "/logs",
    response_model=list[ReminderLogResponseSchema]
)
def logs(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_reminder_logs(
        db,
        current_user.id
    )
    
    
    