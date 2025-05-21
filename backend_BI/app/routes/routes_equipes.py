from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import schema_equipe as equipeSchema
from app.crud import crud_equipe as crudEquipe
from app.database import database

# Create an instance of APIRouter to handle routes for Equipe
router = APIRouter()

# ---------------------------------- Getting
@router.get("/equipes", response_model=list[equipeSchema.EquipeOut], summary="(READ) Get all equipe records")
def read_equipes(db: Session = Depends(database.get_db)):
    """
    Retrieve all equipe records from the database.

    - **db**: Database session dependency.

    Returns a list of all `Equipe` records.
    """
    return crudEquipe.get_all_equipes(db)

@router.get("/equipes/{equipe_id}", response_model=equipeSchema.EquipeOut, summary="(READ) Get equipe record by id")
def read_equipe(equipe_id: int, db: Session = Depends(database.get_db)):
    """
    Retrieve a specific equipe record by ID.

    - **equipe_id**: The ID of the equipe to retrieve.
    - **db**: Database session dependency.

    Raises 404 if not found.
    """
    equipe = crudEquipe.get_equipe_by_id(db, equipe_id)
    if equipe is None:
        raise HTTPException(status_code=404, detail=f"(READ) Equipe record with ID {equipe_id} was not found")
    return equipe

# ------------------------------ Creation (if necessary)
# Add any creation routes here if needed, for example:
# @router.post("/equipes", response_model=equipeSchema.EquipeOut, summary="(CREATE) Create a new equipe record")
# def create_equipe(equipe: equipeSchema.EquipeCreate, db: Session = Depends(database.get_db)):
#    ...

# -------------------------- Updating (if needed)
# Add update routes if applicable, for example:
# @router.put("/equipe/{equipe_id}", response_model=equipeSchema.EquipeOut, summary="(UPDATE) Update an equipe record")
# def update_equipe(equipe_id: int, equipe_update: equipeSchema.EquipeUpdate, db: Session = Depends(database.get_db)):
#    ...

# -------------------------- Deletion (if needed)
# @router.delete("/equipe/{equipe_id}", status_code=204, summary="(DELETE) Delete an equipe record")
# def delete_equipe(equipe_id: int, db: Session = Depends(database.get_db)):
#    ...
