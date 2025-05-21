from sqlalchemy.orm import Session
from app.models.model_stock import StockModel

#----------------------------- READ ---------------------------------
def get_all_stock(db: Session):
    """
    Retrieve all Stock records.

    Args:
        db (Session): Database session.

    Returns:
        List[StockModel]: All Stock records.
    """
    return db.query(StockModel).all()

def get_stock_by_id(db: Session, stock_id: int):
    """
    Retrieve a single Stock by its ID.

    Args:
        db (Session): Database session.
        stock_id (int): Stock ID.

    Returns:
        StockModel | None: Found record or None if not found.
    """
    return db.query(StockModel).filter(StockModel.ID_Stock == stock_id).first()
