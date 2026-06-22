from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.client_repository import create_client
from app.repositories.client_repository import delete_client_by_id_and_user
from app.repositories.client_repository import get_client_by_id_and_user
from app.repositories.client_repository import list_clients_by_user
from app.repositories.client_repository import update_client

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


def update_user_client(
    db: Session,
    user_id: str,
    client_id: str,
    client_data: ClientCreateSchema
):
    client = get_client_by_id_and_user(
        db=db,
        client_id=client_id,
        user_id=user_id
    )

    if not client:
        raise HTTPException(
            status_code=404,
            detail="Cliente não encontrado."
        )

    return update_client(
        db=db,
        client=client,
        client_data=client_data
    )


def delete_user_client(
    db: Session,
    user_id: str,
    client_id: str
):
    deleted = delete_client_by_id_and_user(
        db=db,
        client_id=client_id,
        user_id=user_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Cliente não encontrado."
        )

    return {
        "status": "deleted"
    }
    
    