import logging
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.core.security import hash_password
from app.core.security import verify_password
from app.repositories.user_repository import create_user
from app.repositories.user_repository import get_user_by_email
from app.schemas.user_schema import UserLoginSchema
from app.schemas.user_schema import UserRegisterSchema
from app.services.email_service import send_email

logger = logging.getLogger(__name__)


def register_user(db: Session, user_data: UserRegisterSchema):
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")

    password_hash = hash_password(user_data.password)
    user = create_user(db, user_data, password_hash)

    try:
        send_email(
            to_email=user.email,
            subject="Bem-vindo ao Lumina! Seu trial de 14 dias começou.",
            message=(
                f"Olá, {user.nome}!\n\n"
                "Sua conta no Lumina foi criada com sucesso.\n\n"
                "Você tem 14 dias grátis para explorar:\n"
                "• Agenda de sessões\n"
                "• Cadastro de clientes\n"
                "• Lembretes automáticos\n"
                "• Métricas e relatórios\n"
                "• Campanhas de relacionamento\n\n"
                f"Seu trial expira em: {user.trial_expires_at.strftime('%d/%m/%Y')}\n\n"
                "Acesse: https://lumina.3g-brasil.com\n\n"
                "Equipe Lumina"
            )
        )
    except Exception as e:
        logger.warning("WELCOME_EMAIL_FAILED user=%s error=%s", user.email, str(e))

    return user


def login_user(db: Session, login_data: UserLoginSchema):
    user = get_user_by_email(db, login_data.email)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")

    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")

    if (
        user.plano == "trial"
        and user.trial_status == "active"
        and user.trial_expires_at
        and datetime.utcnow() > user.trial_expires_at
    ):
        user.trial_status = "expired"
        db.commit()

    access_token = create_access_token({"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

