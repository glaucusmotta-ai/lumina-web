from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.session_repository import create_session
from app.repositories.session_repository import delete_session_by_id_and_user
from app.repositories.session_repository import get_session_by_id_and_user
from app.repositories.session_repository import list_sessions_by_user
from app.repositories.session_repository import update_session

from app.schemas.session_schema import SessionCreateSchema
from app.schemas.session_schema import SessionUpdateSchema


def create_user_session(
    db: Session,
    user_id: str,
    session_data: SessionCreateSchema
):
    return create_session(
        db,
        user_id,
        session_data
    )


def get_user_sessions(
    db: Session,
    user_id: str
):
    return list_sessions_by_user(
        db,
        user_id
    )


def update_user_session(
    db: Session,
    session_id: str,
    user_id: str,
    session_data: SessionUpdateSchema
):
    session = get_session_by_id_and_user(
        db=db,
        session_id=session_id,
        user_id=user_id
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Sessão não encontrada"
        )

    return update_session(
        db=db,
        session=session,
        session_data=session_data
    )


def delete_user_session(
    db: Session,
    session_id: str,
    user_id: str
):
    deleted = delete_session_by_id_and_user(
        db,
        session_id,
        user_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Sessão não encontrada"
        )

    return {
        "message": "Sessão removida com sucesso"
    }
    
    
    