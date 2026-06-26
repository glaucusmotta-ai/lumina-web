from datetime import datetime
from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from jose import jwt
from sqlalchemy.orm import Session

from app.config.settings import settings
from app.database.database import get_db
from app.repositories.user_repository import get_user_by_id

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=True)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=401, detail="Token inválido.")
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_id(db, user_id)
    if not user:
        raise credentials_exception
    return user


def get_active_user(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.plano in ("essencial", "pro", "clinica"):
        return user

    if user.plano == "trial":
        if user.trial_status == "active":
            if user.trial_expires_at and datetime.utcnow() > user.trial_expires_at:
                user.trial_status = "expired"
                db.commit()
                raise HTTPException(status_code=403, detail="trial_expired")
            return user
        if user.trial_status == "expired":
            raise HTTPException(status_code=403, detail="trial_expired")

    raise HTTPException(status_code=403, detail="Acesso não autorizado.")

