"""
This module defines a single administrative endpoint used for full data deletion across all tables.

**Use with extreme caution.**

Endpoint:
- DELETE /everything: Deletes all records from all database tables (requires confirmation).
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.crud import crud_common as crudCommon
from app.database import database 

router = APIRouter()

@router.delete("/everything", status_code=204, summary="(RECORD) Delete all data")
def delete_everything(
    confirm_deletion: str = Query(None, alias="confirm", description="Set to 'true' to confirm full wipe"),
    db: Session = Depends(database.get_db)
):
    """
    Delete **all** data from the database.

    This endpoint is intended for development or reset purposes and will remove all records
    from all managed tables. The operation is **irreversible**.

    - **confirm_deletion**: Must be explicitly set to `"true"` to confirm the operation.
    - **db**: Database session dependency.

    Raises:
    - HTTP 400 if the confirmation parameter is missing or incorrect.
    - HTTP 500 if an internal error occurs during deletion.
    """
    if confirm_deletion != "true":
        raise HTTPException(status_code=400, detail=f"(DELETE) required: set confirm=true.")
    try:
        crudCommon.delete_all(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"(DELETE) All data deletion raised an Internal error during full wipe: {str(e)}")
    return