from fastapi import APIRouter
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.schemas.user_schema import UserLoginSchema
from app.schemas.user_schema import UserRegisterSchema
from app.schemas.user_schema import UserResponseSchema
from app.services.auth_service import login_user
from app.services.auth_service import register_user

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/register", response_model=UserResponseSchema)
def register(
    user_data: UserRegisterSchema,
    db: Session = Depends(get_db)
):
    return register_user(db, user_data)


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    login_data = UserLoginSchema(
        email=form_data.username,
        password=form_data.password
    )
    return login_user(db, login_data)


@router.get("/me", response_model=UserResponseSchema)
def me(
    current_user=Depends(get_current_user)
):
    return current_user
