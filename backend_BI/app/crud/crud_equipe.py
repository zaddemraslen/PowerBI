from sqlalchemy.orm import Session
from app.models.model_equipe import ÉquipeModel

#----------------------------- READ ---------------------------------
def get_all_equipes(db: Session):
    """
    Retrieve all Equipe records.

    Args:
        db (Session): Database session.

    Returns:
        List[EquipeModel]: All Equipe records.
    """
    return db.query(ÉquipeModel).all()

def get_equipe_by_id(db: Session, equipe_id: int):
    """
    Retrieve a single Equipe by its ID.

    Args:
        db (Session): Database session.
        equipe_id (int): Equipe ID.

    Returns:
        EquipeModel | None: Found record or None if not found.
    """
    return db.query(ÉquipeModel).filter(ÉquipeModel.ID_Équipe == equipe_id).first()
