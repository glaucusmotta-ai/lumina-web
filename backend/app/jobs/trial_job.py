import logging
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.repositories.user_repository import expire_trial_users

logger = logging.getLogger(__name__)


def run_trial_expiration():
    db: Session = SessionLocal()
    try:
        expired_count = expire_trial_users(db)
        logger.info("TRIAL_EXPIRATION_JOB expired=%s", expired_count)
    except Exception as e:
        logger.exception("TRIAL_EXPIRATION_JOB_ERROR error=%s", str(e))
    finally:
        db.close()
        
        