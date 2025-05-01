"""
This module contains the routes for handling operations related to 'Commande' (Order) records.
It provides endpoints for performing CRUD (Create, Read, Update, Delete) operations on the Commande entity.

Each route interacts with the Commande model via the corresponding CRUD functions from the `crud_commande` module.

- **GET /commandes**: Fetch all commandes (orders).
- **GET /commandes/{commande_id}**: Fetch a specific commande by ID.
- **GET /commandes/filter/without-production**: Fetch commandes that do not have an associated production.
- **POST /commandes**: Create a new commande.
- **PUT /commande/{commande_id}**: Update an existing commande by its ID.
- **DELETE /commande/{commande_id}**: Delete a specific commande by its ID.
- **DELETE /commandes/without-production**: Delete commandes that have no corresponding production, requires confirmation.
- **DELETE /commandes**: Delete all commandes, requires confirmation.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.schemas import schema_commande as cmdSchema
from app.crud import crud_commande as crudCmd
from app.database import database
from app.models.model_commande import CommandeModel 

# Create an instance of APIRouter to handle routes for Commande (Order)
router = APIRouter()

#--------------------------- Getting
@router.get("/commandes", response_model=list[cmdSchema.CommandeOut], summary="(READ) Get all commandes records")
def read_commandes(db: Session = Depends(database.get_db)):
    """
    Endpoint to fetch all commandes (orders) from the database.

    - **db**: Session dependency to interact with the database.

    Returns a list of all commandes.
    """
    return crudCmd.get_all_commandes(db)

@router.get("/commandes/{commande_id}", response_model=cmdSchema.CommandeOut, summary="(READ) Get commande record by id")
def read_commande(commande_id: int, db: Session = Depends(database.get_db)):
    """
    Endpoint to fetch a specific commande by its ID.

    - **commande_id**: The unique ID of the commande.
    - **db**: Session dependency to interact with the database.

    Raises HTTP 404 if the commande with the provided ID does not exist.

    Returns the commande with the specified ID.
    """
    cmd = crudCmd.get_commande_by_id(db, commande_id)
    if cmd is None:
        raise HTTPException(status_code=404, detail=f"(READ) Commande record with ID {commande_id} was not found")
    return cmd

@router.get("/commandes/filter/without-production", response_model=list[cmdSchema.CommandeOut], summary="(READ) Get commandes without production")
def get_commandes_without_production(db: Session = Depends(database.get_db)):
    """
    Endpoint to fetch all commandes that do not have an associated production record.

    - **db**: Session dependency to interact with the database.

    Returns a list of commandes without any production.
    """
    cmds_without_prod= crudCmd.get_commandes_without_production(db)
    return cmds_without_prod

# --------------------------Creation
@router.post("/commandes", response_model=cmdSchema.CommandeOut, summary="(CREATE) create a new commande record")
def create_commande(commande: cmdSchema.CommandeCreate, db: Session = Depends(database.get_db)):
    """
    Endpoint to create a new commande (order) record.

    - **commande**: The commande data to create (from CommandeCreate schema).
    - **db**: Session dependency to interact with the database.

    Returns the newly created commande.
    """
    new_cmd = CommandeModel(**commande.model_dump())
    return crudCmd.create_commande(db, new_cmd)

# ----------------------------------- Updating
@router.put("/commande/{commande_id}", response_model=cmdSchema.CommandeOut, summary="(UPDATE) update a commande record")
def update_commande(commande_id: int, commande_update: cmdSchema.CommandeUpdate, db: Session= Depends(database.get_db)):
    """
    Endpoint to update an existing commande by its ID.

    - **commande_id**: The ID of the commande to update.
    - **commande_update**: The data to update (from CommandeUpdate schema).
    - **db**: Session dependency to interact with the database.

    Raises HTTP 404 if the commande with the provided ID does not exist.
    Returns the updated commande.
    """
    existing_cmd= crudCmd.get_commande_by_id(db, commande_id)
    if not existing_cmd:
        raise HTTPException(status_code=404, detail= f"Commande record can not be updated as its ID {commande_id} was not not found")
    
    # Convert the update payload into a dictionary, excluding unset fields (so we only update what was sent)
    updates= commande_update.model_dump(exclude_unset= True)
    
    return crudCmd.update_commande(db, existing_cmd, updates)

#------------------------------------- Deletion
@router.delete("/commande/{commande_id}", status_code= 204, summary= "delete a commande record")
def delete_commande(commande_id: int, db: Session= Depends(database.get_db)):
    """
    Endpoint to delete a specific commande by its ID.

    - **commande_id**: The ID of the commande to delete.
    - **db**: Session dependency to interact with the database.

    Raises HTTP 404 if the commande with the provided ID does not exist.
    Returns HTTP 204 status on successful deletion.
    """
    existing_cmd= crudCmd.get_commande_by_id(db, commande_id)
    if not existing_cmd:
        raise HTTPException(status_code= 404, detail= f"(DELETE) commande record with ID {commande_id} was not found")
    
    crudCmd.delete_commande(db, existing_cmd)
    return

@router.delete("/commandes/without-production", status_code=204, summary="(DEMETE) Delete commandes without production")
def delete_commandes_without_production(
    confirm_deletion: str = Query(None, alias="confirm", description="Set to 'true' to confirm deletion"),
    db: Session = Depends(database.get_db)
):
    """
    Endpoint to delete commandes that have no corresponding production.

    - **confirm_deletion**: Query parameter to confirm deletion (must be 'true' to proceed).
    - **db**: Session dependency to interact with the database.

    Returns HTTP 400 if confirmation is not provided.
    Returns HTTP 204 status on successful deletion.
    """
    if confirm_deletion != "true":
        raise HTTPException(status_code=400, detail=f"(DELETE) commande records without corresponding production records deletion require Confirmation: set confirm=true.")
    crudCmd.delete_commandes_without_production(db)
    return

@router.delete("/commandes", status_code= 204, summary= "(DELETE) delete all commandes")
def delete_all_commandes(
    confirm_deletion: str =  Query(None, alias="confirm", description= "set to true to confirm deletion"),
    db: Session= Depends(database.get_db)):
    """
    Endpoint to delete all commandes.

    - **confirm_deletion**: Query parameter to confirm deletion (must be 'true' to proceed).
    - **db**: Session dependency to interact with the database.

    Returns HTTP 400 if confirmation is not provided.
    Returns HTTP 204 status on successful deletion.
    """
    if confirm_deletion !="true":
        raise HTTPException(status_code= 400, detail= f"(RECORD) commandes records deletion require Confirmation: set confirm=true.")
    crudCmd.delete_all_commandes(db)
    return
