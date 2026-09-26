from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db

app = FastAPI()


@app.get("/health/database")
def database_health(db: Session = Depends(get_db)):
    value = db.scalar(text("SELECT 1"))

    return {
        "connected": value == 1,
    }
