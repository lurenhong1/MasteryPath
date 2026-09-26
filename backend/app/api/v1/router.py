from fastapi import APIRouter

from app.api.v1.endpoints import concepts

router = APIRouter()

router.include_router(concepts.router)
