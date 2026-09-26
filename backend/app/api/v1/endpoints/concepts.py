from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories import concepts as concept_repository

router = APIRouter(
    prefix="/concepts",
    tags=["concepts"],
)


@router.get("")
def get_concepts(db: Session = Depends(get_db)):
    return concept_repository.get_all(db)
