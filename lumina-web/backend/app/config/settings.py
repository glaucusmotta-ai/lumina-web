from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str

    APP_ENV: str

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    DATABASE_URL: str

    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_EMAIL: str
    SMTP_PASSWORD: str

    REMINDER_FROM_NAME: str

    class Config:
        env_file = ".env"


settings = Settings()

