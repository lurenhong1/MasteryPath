from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db

from app.api.v1.router import router as v1_router

app = FastAPI()
app.include_router(v1_router, prefix="/api/v1")

@app.get("/health/database")
def database_health(db: Session = Depends(get_db)):
    value = db.scalar(text("SELECT 1"))

    return {
        "connected": value == 1,
    }
