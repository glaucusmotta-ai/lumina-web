from pydantic import BaseModel


class ReminderTodaySchema(BaseModel):
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


class ReminderSendSchema(BaseModel):
    session_id: str


class ReminderLogResponseSchema(BaseModel):
    id: str
    session_id: str
    user_id: str

    cliente_nome: str | None = None
    cliente_email: str | None = None

    servico: str | None = None
    data: str | None = None
    horario: str | None = None

    canal: str
    destinatario: str

    tipo: str

    reminder_offset_minutes: str | None = None

    status: str

    sent_at: str | None = None

    error_message: str | None = None

    class Config:
        from_attributes = True
        
        