from pydantic import BaseModel
from datetime import date

class Stock_Base(BaseModel):
    ID_Stock: int
    Produit: str
    Quantité_Disponible: int
    Lieu_Stockage: str
    Type_Matière: str
    Mise_à_Jour: date

    class Config:
        # Ensures Pydantic models use attributes of SQLAlchemy models
        from_attributes = True

class StockOut(Stock_Base):
    class Config:
        # Ensures Pydantic models use attributes of SQLAlchemy models
        from_attributes = True