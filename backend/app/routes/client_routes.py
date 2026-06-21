from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.schemas.client_schema import ClientCreateSchema
from app.schemas.client_schema import ClientResponseSchema
from app.services.client_service import create_user_client
from app.services.client_service import get_user_clients

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
    current_user=Depends(get_current_user)
):
    return create_user_client(
        db,
        current_user.id,
        client_data
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
        db,
        current_user.id
    )
    
    