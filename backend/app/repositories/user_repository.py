from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models.user_model import User
from app.schemas.user_schema import UserRegisterSchema


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user_data: UserRegisterSchema, password_hash: str):
    trial_expires = datetime.utcnow() + timedelta(days=14)
    user = User(
        nome=user_data.nome,
        email=user_data.email,
        documento=user_data.documento,
        telefone=user_data.telefone,
        password_hash=password_hash,
        plano="trial",
        trial_status="active",
        trial_expires_at=trial_expires,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user_plan(db: Session, user_id: str, plano: str, trial_status: str = "converted"):
    user = get_user_by_id(db, user_id)
    if user:
        user.plano = plano
        user.trial_status = trial_status
        db.commit()
        db.refresh(user)
    return user


def expire_trial_users(db: Session):
    now = datetime.utcnow()
    expired = db.query(User).filter(
        User.plano == "trial",
        User.trial_status == "active",
        User.trial_expires_at <= now,
    ).all()
    for user in expired:
        user.trial_status = "expired"
    db.commit()
    return len(expired)

