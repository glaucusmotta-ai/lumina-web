import logging

from sqlalchemy.orm import Session

from app.models.client_model import Client
from app.schemas.client_schema import ClientCreateSchema


logger = logging.getLogger(__name__)


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
        origem_cliente=client_data.origem_cliente,
        regiao=client_data.regiao,
        local_atendimento=client_data.local_atendimento,
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


def get_client_by_id_and_user(
    db: Session,
    client_id: str,
    user_id: str
):
    client = db.query(Client).filter(
        Client.id == client_id,
        Client.user_id == user_id
    ).first()

    if client:
        return client

    fallback = db.query(Client).filter(
        Client.id == client_id
    ).first()

    if fallback:
        logger.warning(
            "CLIENT_OWNERSHIP_BLOCKED client_id=%s requested_user_id=%s owner_user_id=%s",
            client_id,
            user_id,
            fallback.user_id
        )
    else:
        logger.warning(
            "CLIENT_NOT_FOUND client_id=%s requested_user_id=%s",
            client_id,
            user_id
        )

    return None


def update_client(
    db: Session,
    client: Client,
    client_data: ClientCreateSchema
):
    client.nome = client_data.nome
    client.telefone = client_data.telefone
    client.whatsapp = client_data.whatsapp
    client.email = client_data.email
    client.observacoes = client_data.observacoes

    client.origem_cliente = client_data.origem_cliente
    client.regiao = client_data.regiao
    client.local_atendimento = client_data.local_atendimento

    client.proxima_sessao = client_data.proxima_sessao
    client.horario_proxima_sessao = client_data.horario_proxima_sessao

    db.commit()
    db.refresh(client)

    return client


def delete_client(
    db: Session,
    client: Client
):
    db.delete(client)
    db.commit()

    return True


def delete_client_by_id_and_user(
    db: Session,
    client_id: str,
    user_id: str
):
    client = get_client_by_id_and_user(
        db=db,
        client_id=client_id,
        user_id=user_id
    )

    if not client:
        return False

    return delete_client(
        db=db,
        client=client
    )
    
    
    