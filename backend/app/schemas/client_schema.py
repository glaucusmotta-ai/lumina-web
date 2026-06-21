from pydantic import BaseModel


class ClientCreateSchema(BaseModel):
    nome: str
    telefone: str | None = None
    whatsapp: str | None = None
    email: str | None = None
    observacoes: str | None = None
    proxima_sessao: str | None = None
    horario_proxima_sessao: str | None = None


class ClientResponseSchema(BaseModel):
    id: str
    user_id: str
    nome: str
    telefone: str | None = None
    whatsapp: str | None = None
    email: str | None = None
    observacoes: str | None = None
    proxima_sessao: str | None = None
    horario_proxima_sessao: str | None = None

    class Config:
        from_attributes = True
        
        
        