from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from app.database.database import Base 

class ÉquipeModel(Base):
    __tablename__ = "Équipe"

    ID_Équipe = Column("ID_Équipe", Integer, primary_key=True, index= True, autoincrement=True)
    Nom_Équipe = Column("Nom_Équipe", String)
    Chef_Équipe = Column("Chef_Équipe", String)
    Effectif = Column("Effectif", Integer)
    Nombre_Heures_Travaillées = Column("Nombre_Heures_travaillées", Integer)
    Disponibilité = Column("Disponibilité", String)
