from sqlalchemy.orm import Session

from app.models.client_model import Client
from app.schemas.client_schema import ClientCreateSchema


def create_client(
    db: Session,
    user_id: str,
    client_data: ClientCreateSchema
):
    client = Client(
        user_id=user_id,
        nome=client_data.nome,
        telefone=client_data.telefone,
        whatsapp=client_data.whatsapp,
        email=client_data.email,
        observacoes=client_data.observacoes,
        proxima_sessao=client_data.proxima_sessao,
        horario_proxima_sessao=client_data.horario_proxima_sessao
    )

    db.add(client)
    db.commit()
    db.refresh(client)

    return client


def list_clients_by_user(
    db: Session,
    user_id: str
):
    return db.query(Client).filter(
        Client.user_id == user_id
    ).order_by(
        Client.nome
    ).all()
    
    
    