from sqlalchemy.orm import Session

from app.repositories.client_repository import create_client
from app.repositories.client_repository import list_clients_by_user
from app.schemas.client_schema import ClientCreateSchema


def create_user_client(
    db: Session,
    user_id: str,
    client_data: ClientCreateSchema
):
    return create_client(
        db,
        user_id,
        client_data
    )


def get_user_clients(
    db: Session,
    user_id: str
):
    return list_clients_by_user(
        db,
        user_id
    )
    
    
    