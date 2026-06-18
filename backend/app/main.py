from fastapi import FastAPI

from app.config.settings import settings
from app.database.init_db import init_db
from app.routes.auth_routes import router as auth_router
from app.routes.session_routes import router as session_router
from app.routes.reminder_routes import router as reminder_router
from app.jobs.scheduler import start_scheduler
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title=settings.APP_NAME
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()
    start_scheduler()


@app.get("/")
def health_check():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV
    }

app.include_router(auth_router)
app.include_router(session_router)
app.include_router(reminder_router)

    
    