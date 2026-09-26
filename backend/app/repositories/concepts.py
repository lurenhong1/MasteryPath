from uuid import UUID

from sqlalchemy import text
from sqlalchemy.orm import Session

def get_all(db: Session) -> list[dict]:
    result = db.execute(
        text("""
            SELECT id, name
            FROM concepts
            ORDER BY name
        """)
    )

    return [dict(row) for row in result.mappings().all()]
