"""
CRUD operations related to Commande records.

Includes:
- Creating new production records.
- Reading and filtering production records.
- Updating existing production records.
- Deleting production records, with optional cascading behavior.
"""
from sqlalchemy.orm import Session
from app.models.models_production import ProductionModel
from sqlalchemy.orm import joinedload

#----------------------------- CREATE ---------------------------------
def create_production(db: Session, production: ProductionModel):
    """
    Create a new production record.

    Args:
        db (Session): SQLAlchemy database session.
        production (ProductionModel): Instance of the production to be added.

    Returns:
        ProductionModel: The newly created production record.
    """
    db.add(production)
    db.commit()
    db.refresh(production)
    return production

#----------------------------- READ ---------------------------------
def get_all_productions(db: Session):
    """
    Retrieve all production records with their related Commande.

    Returns:
        List[ProductionModel]: List of production records with joined Commande data.
    """
    return db.query(ProductionModel).options(joinedload(ProductionModel.commande)).all()

def get_all_productions_flat(db: Session):
    """
    Retrieve all production records without joining related data.

    Returns:
        List[ProductionModel]: List of production records.
    """
    return db.query(ProductionModel).all()

def get_production_by_id(db: Session, production_id: int):
    """
    Get a single production record by its ID.

    Returns:
        ProductionModel | None: Production record or None if not found.
    """
    return db.query(ProductionModel).filter(ProductionModel.id_production == production_id).first()

def get_production_flat_by_id(db: Session, production_id: int):
    """
    Get a production record by ID, flat version (no joined relationships).

    Returns:
        ProductionModel | None: Production record or None if not found.
    """
    return db.query(ProductionModel).filter(ProductionModel.id_production == production_id).first()

def get_productions_by_commande_id(db: Session, commande_id: int):
    """
    Get all production records linked to a specific commande.

    Returns:
        List[ProductionModel]: Productions linked to the given commande.
    """
    return db.query(ProductionModel).filter(ProductionModel.id_commande == commande_id).all()

def get_productions_flat_by_commande_id(db: Session, commande_id: int):
    """
    Flat version: Get all production records linked to a specific commande.

    Returns:
        List[ProductionModel]: Flat productions linked to the given commande.
    """
    return db.query(ProductionModel).filter(ProductionModel.id_commande == commande_id).all()

#----------------------------- UPDATE ---------------------------------
def update_production(db: Session, production: ProductionModel, updates: dict):
    """
    Update an existing production record with the given fields.

    Args:
        db (Session): Database session.
        production (ProductionModel): Existing production record (already fetched).
        updates (dict): Dictionary of fields and new values.

    Returns:
        ProductionModel: Updated production record.
    
    Note:
        This method assumes existence validation is done at the router level.
    """
    for key, value in updates.items():
        setattr(production, key, value)
    db.commit()
    db.refresh(production)
    return production

#----------------------------- DELETE ---------------------------------
def delete_production(db: Session, production: ProductionModel):
    """
    Delete a single production record.

    Args:
        db (Session): Database session.
        production (ProductionModel): Record to delete (should be pre-validated).
    """
    db.delete(production)
    db.commit()

def delete_all_productions(db: Session):
    """
    Delete all production records from the database.

    Args:
        db (Session): Database session.
    """
    db.query(ProductionModel).delete()
    db.commit()

