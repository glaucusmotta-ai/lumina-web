from sqlalchemy.orm import Session

from app.repositories.session_repository import create_session
from app.repositories.session_repository import list_sessions_by_user
from app.schemas.session_schema import SessionCreateSchema
from app.repositories.session_repository import delete_session_by_id_and_user


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

def delete_user_session(
    db: Session,
    session_id: str,
    user_id: str
):
    return delete_session_by_id_and_user(
        db,
        session_id,
        user_id
    )
    
        
    
    