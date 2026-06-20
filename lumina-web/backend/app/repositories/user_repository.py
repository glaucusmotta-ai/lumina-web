from sqlalchemy.orm import Session

from app.models.user_model import User
from app.schemas.user_schema import UserRegisterSchema


def get_user_by_email(
    db: Session,
    email: str
):
    return db.query(User).filter(
        User.email == email
    ).first()


def get_user_by_id(
    db: Session,
    user_id: str
):
    return db.query(User).filter(
        User.id == user_id
    ).first()


def create_user(
    db: Session,
    user_data: UserRegisterSchema,
    password_hash: str
):
    user = User(
        nome=user_data.nome,
        email=user_data.email,
        documento=user_data.documento,
        telefone=user_data.telefone,
        password_hash=password_hash
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


