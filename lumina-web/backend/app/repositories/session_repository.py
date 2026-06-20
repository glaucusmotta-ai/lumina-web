from sqlalchemy.orm import Session

from app.models.session_model import Session as SessionModel
from app.schemas.session_schema import SessionCreateSchema


def create_session(
    db: Session,
    user_id: str,
    session_data: SessionCreateSchema
):
    session = SessionModel(
        user_id=user_id,
        cliente_nome=session_data.cliente_nome,
        cliente_whatsapp=session_data.cliente_whatsapp,
        cliente_email=session_data.cliente_email,
        servico=session_data.servico,
        data=session_data.data,
        horario=session_data.horario,
        status=session_data.status
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


def list_sessions_by_user(
    db: Session,
    user_id: str
):
    return db.query(SessionModel).filter(
        SessionModel.user_id == user_id
    ).order_by(
        SessionModel.data,
        SessionModel.horario
    ).all()
    
    
    