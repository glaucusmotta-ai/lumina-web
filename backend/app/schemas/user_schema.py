from pydantic import BaseModel
from pydantic import EmailStr


class UserRegisterSchema(BaseModel):
    nome: str
    email: EmailStr
    documento: str | None = None
    telefone: str | None = None
    password: str


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str


class UserResponseSchema(BaseModel):
    id: str
    nome: str
    email: EmailStr
    documento: str | None = None
    telefone: str | None = None
    plano: str
    trial_status: str

    class Config:
        from_attributes = True
        
        
        