from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.schemas.session_schema import SessionCreateSchema
from app.schemas.session_schema import SessionResponseSchema
from app.services.session_service import create_user_session
from app.services.session_service import get_user_sessions
from app.services.session_service import delete_user_session

router = APIRouter(
    prefix="/sessions",
    tags=["Sessions"]
)


@router.post(
    "",
    response_model=SessionResponseSchema
)
def create_session(
    session_data: SessionCreateSchema,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_user_session(
        db,
        current_user.id,
        session_data
    )


@router.get(
    "",
    response_model=list[SessionResponseSchema]
)
def list_sessions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_user_sessions(
        db,
        current_user.id
    )

@router.delete("/{session_id}")
def delete_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    deleted = delete_user_session(
        db,
        session_id,
        current_user.id
    )

    if not deleted:
        return {
            "success": False,
            "message": "Sessão não encontrada."
        }

    return {
        "success": True
    }
    
        
    
    