"""
Common CRUD operations that span multiple models, such as bulk deletion.

This module contains atomic operations that affect multiple tables,
ensuring database consistency using transactions and rollback.
"""

from sqlalchemy.orm import Session
from app.models.models_production import ProductionModel
from app.models.model_commande import  CommandeModel
from app.models.model_equipe import ÉquipeModel
from app.models.model_stock import StockModel

def delete_all(db: Session):
    """
    Atomically delete all records from both Production and Commande tables as well as stocks and équipes.

    This operation wraps both deletions in a transaction block to ensure
    that if either deletion fails, no partial changes are committed.

    Args:
        db (Session): SQLAlchemy database session.

    Raises:
        Exception: Re-raises any exception encountered after rolling back the transaction.
    
    Note:
        This function bypasses model-level delete cascades and deletes records directly via SQL.
        It avoids using other CRUD methods like `delete_all_productions()` or `delete_all_commandes()`
        to keep the logic atomic and independent of those method-specific side effects.
    """
    try:
        db.query(ProductionModel).delete()
        db.query(CommandeModel).delete()
        db.query(ÉquipeModel).delete()
        db.query(StockModel).delete()
        db.commit()
    except Exception as e:
        db.rollback() # undoes all changes above
        raise e