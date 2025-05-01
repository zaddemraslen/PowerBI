"""
CRUD operations related to Commande records.

Includes:
- Creating new Commande records.
- Reading and filtering Commande records.
- Updating existing Commande records.
- Deleting Commande records, with optional cascading behavior.
"""

from sqlalchemy.orm import Session
from app.models.models_production import ProductionModel
from app.models.model_commande import  CommandeModel
from app.crud.crud_production  import get_productions_by_commande_id, get_productions_flat_by_commande_id

#----------------------------- CREATE ---------------------------------
def create_commande(db: Session, commande: CommandeModel):
    """
    Create a new Commande record in the database.

    Args:
        db (Session): SQLAlchemy database session.
        commande (CommandeModel): The Commande instance to persist.

    Returns:
        CommandeModel: The created Commande record.
    """
    db.add(commande)
    db.commit()
    db.refresh(commande)
    return commande

#----------------------------- READ ---------------------------------
def get_all_commandes(db: Session):
    """
    Retrieve all Commande records.

    Args:
        db (Session): Database session.

    Returns:
        List[CommandeModel]: All Commande records.
    """
    return db.query(CommandeModel).all()

def get_commande_by_id(db: Session, commande_id: int):
    """
    Retrieve a single Commande by its ID.

    Args:
        db (Session): Database session.
        commande_id (int): Commande ID.

    Returns:
        CommandeModel | None: Found record or None if not found.
    """
    return db.query(CommandeModel).filter(CommandeModel.id_commande == commande_id).first()

def get_commandes_without_production(db: Session):
    """
    Fetch all Commande records that have no associated Production.

    Args:
        db (Session): Database session.

    Returns:
        List[CommandeModel]: Commandes with no production records.
    """
    print("hello")
    return (
        db.query(CommandeModel)
        .outerjoin(ProductionModel, CommandeModel.id_commande == ProductionModel.id_commande)
        .filter(ProductionModel.id_commande.is_(None)) # No matching production
        .all()
    )

#----------------------------- UPDATE ---------------------------------
def update_commande(db: Session, commande: CommandeModel, updates: dict):
    """
    Update an existing Commande record with new values.

    Args:
        db (Session): Database session.
        commande (CommandeModel): The existing record to update.
        updates (dict): Dictionary of updated field values.

    Returns:
        CommandeModel: The updated record.
    
    Note:
        Record existence should be verified before calling this method.
    """
    for key, value in updates.items():
        setattr(commande, key, value)
    db.commit()
    db.refresh(commande)
    return commande

#----------------------------- DELETE ---------------------------------
def delete_commande(db: Session, commande: CommandeModel):
    """
    Delete a Commande and all related Production records.

    Args:
        db (Session): Database session.
        commande (CommandeModel): The Commande to delete.
    """

    # Retrieve all related productions via helper method
    related_productions= get_productions_by_commande_id(db, commande.id_commande)
    
    # Delete each production explicitly
    for prod in related_productions:
        db.delete(prod)

    # Then delete the commande itself
    db.delete(commande)
    db.commit()

def delete_commandes_without_production(db: Session):
    """
    Delete all Commande records that do not have associated Production records.

    Args:
        db (Session): Database session.
    """
    commande_without_production= get_commandes_without_production(db)
    for cmd_without_prod in commande_without_production:
        db.delete(cmd_without_prod)
    db.commit()

def delete_all_commandes(db: Session):
    """
    Delete all Commande records and their associated Productions.

    Args:
        db (Session): Database session.
    """
    all_commandes= get_all_commandes(db)

    for cmd in all_commandes:
        related_productions= get_productions_flat_by_commande_id(db, cmd.id_commande)

        for prod in related_productions:
            db.delete(prod)
            
        db.delete(cmd) 
    db.commit()