from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from app.database.database import Base 

class StockModel(Base):
    __tablename__ = "Stock"

    ID_Stock = Column("ID_Stock", Integer, primary_key=True, autoincrement=True, index= True)
    Produit = Column("Produit", String)
    Quantité_Disponible = Column("Quantité_Disponible", Integer)
    Lieu_Stockage = Column("Lieu_Stockage", String)
    Type_Matière = Column("Type_Matière", String)
    Mise_à_Jour = Column("Mise_à_Jour", Date)