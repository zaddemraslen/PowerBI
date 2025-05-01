"""
This module defines the FastAPI routes for handling CRUD operations on the `Production` resource.
It includes endpoints for listing, retrieving, creating, updating, and deleting production records,
as well as retrieving production data in a flattened schema format and by related `Commande` ID.

Endpoints:
- GET /productions: List all production records.
- GET /productions/flat: List all production records (flattened format).
- GET /productions/{id}: Get a specific production by ID.
- GET /productions/flat/{id}: Get a specific flat production by ID.
- GET /productions/by_command_id/{commande_id}: Get productions by associated commande ID.
- GET /productions/by_command_id/flat/{commande_id}: Same as above, flattened.
- POST /productions: Create a new production.
- PUT /production/{id}: Update an existing production.
- DELETE /production/{id}: Delete a specific production.
- DELETE /productions: Delete all productions (requires confirmation).
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.schemas import schema_production as prodSchema
from app.crud import crud_production as crudProd
from app.crud import crud_commande as crudCmd
from app.database import database
from app.models.models_production import ProductionModel

# Create an instance of APIRouter to handle routes for Commande (Order)
router = APIRouter()

# ---------------------------------- Getting
@router.get("/productions", response_model=list[prodSchema.ProductionOut], summary="(READ) Get all production records")
def read_productions(db: Session = Depends(database.get_db)):
    """
    Retrieve all production records from the database.

    - **db**: Database session dependency.

    Returns a list of all `Production` records.
    """
    return crudProd.get_all_productions(db)

@router.get("/productions/flat", response_model= list[prodSchema.ProductionFlatOut], summary="(READ) Get all production flat records")
def read_productions_flat(db: Session= Depends(database.get_db)):
    """
    Retrieve all production records in a flat schema format.

    - **db**: Database session dependency.

    Returns a list of flattened `Production` records.
    """
    return crudProd.get_all_productions_flat(db)

@router.get("/productions/{production_id}", response_model=prodSchema.ProductionOut, summary="(READ) Get production record by id")
def read_production(production_id: int, db: Session = Depends(database.get_db)):
    """
    Retrieve a specific production record by ID.

    - **production_id**: The ID of the production to retrieve.
    - **db**: Database session dependency.

    Raises 404 if not found.
    """
    prod = crudProd.get_production_by_id(db, production_id)
    if prod is None:
        raise HTTPException(status_code=404, detail=f"(READ) Production record with ID {production_id} was not found")
    return prod

@router.get("/productions/flat/{production_id}", response_model= prodSchema.ProductionFlatOut, summary= "(READ) Get flat production by id")
def read_production_flat(production_id: int, db: Session= Depends(database.get_db)):
    """
    Retrieve a specific production record by ID in flat format.

    - **production_id**: The ID of the production.
    - **db**: Database session dependency.

    Raises 404 if not found.
    """
    prod_flat= crudProd.get_production_flat_by_id(db, production_id)
    if prod_flat is None:
        raise HTTPException(status_code=404, detail=f"(READ) Production flat record with ID {production_id} was not found")
    return prod_flat

# related_productions= get_productions_by_commande_id(db, cmd.id_commande)
@router.get("/productions/by_command_id/{commande_id}", response_model= list[prodSchema.ProductionOut], summary= "(READ) Get productions records by commande id")
def read_production_by_commande_id(commande_id: int, db: Session= Depends(database.get_db)):
    """
    Retrieve production records associated with a specific `Commande` ID.

    - **commande_id**: The ID of the related commande.
    - **db**: Database session dependency.
    """
    return crudProd.get_productions_by_commande_id(db, commande_id)

# related_productions= get_productions_by_commande_id(db, cmd.id_commande)
@router.get("/productions/by_command_id/flat/{commande_id}", response_model= list[prodSchema.ProductionFlatOut], summary= "(READ) Get productions flat records by commande id")
def read_productions_flat_by_commande_id(commande_id: int, db: Session= Depends(database.get_db)):
    """
    Retrieve flat-format production records associated with a specific `Commande` ID.

    - **commande_id**: The ID of the related commande.
    - **db**: Database session dependency.
    """
    return crudProd.get_productions_flat_by_commande_id(db, commande_id)

# ------------------------------ Creation
@router.post("/productions", response_model=prodSchema.ProductionOut, summary="(CREATE) Create a new production record")
def create_production(production: prodSchema.ProductionCreate, db: Session = Depends(database.get_db)):
    """
    Create a new production record.

    - **production**: Input schema for creating a production.
    - **db**: Database session dependency.

    Raises 400 if the associated `Commande` ID does not exist.
    """
    if not crudCmd.get_commande_by_id(db, production.id_commande):
        raise HTTPException(
            status_code=400,
            detail= f"(CREATE) new production record can not be created as the corresponding commande record with requested ID {production.id_commande} does not exist."
        )
    new_prod = ProductionModel(**production.model_dump())
    return crudProd.create_production(db, new_prod)

# -------------------------- Updating
@router.put("/production/{production_id}", response_model=prodSchema.ProductionOut, summary="(UPDATE) Update a production record")
def update_production(production_id: int, production_update: prodSchema.ProductionUpdate, db: Session= Depends(database.get_db)):
    """
    Update an existing production record by its ID.

    - **production_id**: The ID of the production to update.
    - **production_update**: Partial update schema.
    - **db**: Database session dependency.

    Raises 404 if production is not found.
    Raises 400 if the new `Commande` ID (if provided) does not exist.
    """
    existing_prod= crudProd.get_production_flat_by_id(db, production_id)
    if not existing_prod:
        raise HTTPException(status_code=404, detail= f"(UPDATE) Production record with ID {production_id} to be updated was not found")
    
    # Convert the update payload into a dictionary, excluding unset fields (so we only update what was sent)
    updates= production_update.model_dump(exclude_unset= True)

    # if the foreign key of the corresponding commande record is to be updared, verify its existing 
    if 'id_commande' in updates and updates['id_commande'] is not None:
        if not crudCmd.get_commande_by_id(db, updates['id_commande']):
            raise HTTPException(status_code= 400, detail= f"(UPDATE) existing production record can not be updated as the the requested commande record with ID {updates['id_commande']} does not exist")
        
    return crudProd.update_production(db, existing_prod, updates)

# --------------------------------- Deletion
@router.delete("/production/{production_id}", status_code= 204, summary="(DELETE) delete a production record")
def delete_production(production_id: int, db: Session= Depends(database.get_db)):
    """
    Delete a specific production record by its ID.

    - **production_id**: The ID of the production to delete.
    - **db**: Database session dependency.

    Raises 404 if the record does not exist.
    """
    existing_prod= crudProd.get_production_by_id(db, production_id)
    if not existing_prod:
        raise HTTPException(status_code=404, detail= f"(DELETE) Production record with ID {production_id} was not found")
    
    crudProd.delete_production(db, existing_prod)
    return 

@router.delete("/productions", status_code= 204, summary= "(DELETE) Delete all production records")
def delete_all_production(
    confirm_deletion: str= Query(None, alias="confirm", description= "set to 'true' to confirm deletion"),
    db: Session= Depends(database.get_db)
    ):
    """
    Delete **all** production records from the database.

    - **confirm_deletion**: Must be 'true' to confirm the operation.
    - **db**: Database session dependency.

    Raises 400 if confirmation is not explicitly provided.
    """
    # Check if the confirm parameter is explicitly 'true'
    if confirm_deletion !="true":
        raise HTTPException(
            status_code= 400,
            detail= f"(DELETE) Confirmation required: Set confirm=true to proceed with deleting all production records."
        )
    # proceed with the actual deletion
    crudProd.delete_all_productions(db)
    return