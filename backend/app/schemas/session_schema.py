from pydantic import BaseModel


class SessionCreateSchema(BaseModel):
    cliente_nome: str
    cliente_whatsapp: str | None = None
    cliente_email: str | None = None
    servico: str
    data: str
    horario: str
    status: str = "agendado"


class SessionUpdateSchema(BaseModel):
    cliente_nome: str | None = None
    cliente_whatsapp: str | None = None
    cliente_email: str | None = None
    servico: str | None = None
    data: str | None = None
    horario: str | None = None
    status: str | None = None


class SessionResponseSchema(BaseModel):
    id: str
    user_id: str
    cliente_nome: str
    cliente_whatsapp: str | None = None
    cliente_email: str | None = None
    servico: str
    data: str
    horario: str
    status: str

    class Config:
        from_attributes = True
        
        