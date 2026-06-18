from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.core.security import hash_password
from app.core.security import verify_password
from app.repositories.user_repository import create_user
from app.repositories.user_repository import get_user_by_email
from app.schemas.user_schema import UserLoginSchema
from app.schemas.user_schema import UserRegisterSchema


def register_user(
    db: Session,
    user_data: UserRegisterSchema
):
    existing_user = get_user_by_email(
        db,
        user_data.email
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="E-mail já cadastrado."
        )

    password_hash = hash_password(user_data.password)

    return create_user(
        db,
        user_data,
        password_hash
    )


def login_user(
    db: Session,
    login_data: UserLoginSchema
):
    user = get_user_by_email(
        db,
        login_data.email
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Credenciais inválidas."
        )

    if not verify_password(
        login_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Credenciais inválidas."
        )

    access_token = create_access_token({
        "sub": user.id
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
    
    
    