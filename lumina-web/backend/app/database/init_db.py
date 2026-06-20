from app.database.database import Base
from app.database.database import engine

from app.models.user_model import User
from app.models.session_model import Session
from app.models.reminder_log_model import ReminderLog


def init_db():
    Base.metadata.create_all(bind=engine)
    
    
    