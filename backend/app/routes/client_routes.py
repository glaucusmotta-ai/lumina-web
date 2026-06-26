from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_active_user
from app.database.database import get_db

from app.schemas.client_schema import ClientCreateSchema
from app.schemas.client_schema import ClientResponseSchema

from app.services.client_service import create_user_client
from app.services.client_service import delete_user_client
from app.services.client_service import get_user_clients
from app.services.client_service import update_user_client


router = APIRouter(
    prefix="/clients",
    tags=["Clients"]
)


@router.post(
    "",
    response_model=ClientResponseSchema
)
def create_client(
    client_data: ClientCreateSchema,
    db: Session = Depends(get_db),
    current_user=Depends(get_active_user)
):
    return create_user_client(
        db=db,
        user_id=current_user.id,
        client_data=client_data
    )


@router.get(
    "",
    response_model=list[ClientResponseSchema]
)
def list_clients(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_user_clients(
        db=db,
        user_id=current_user.id
    )


@router.put(
    "/{client_id}",
    response_model=ClientResponseSchema
)
def update_client_route(
    client_id: str,
    client_data: ClientCreateSchema,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return update_user_client(
        db=db,
        user_id=current_user.id,
        client_id=client_id,
        client_data=client_data
    )


@router.delete(
    "/{client_id}"
)
def delete_client_route(
    client_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return delete_user_client(
        db=db,
        user_id=current_user.id,
        client_id=client_id
    )
    
    