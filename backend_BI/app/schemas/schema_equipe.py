from pydantic import BaseModel

class Equipe_Base(BaseModel):
    ID_Équipe: int
    Nom_Équipe: str
    Chef_Équipe: str
    Effectif: int
    Nombre_Heures_Travaillées: int
    Disponibilité: str

    class Config:
        # Ensures Pydantic models use attributes of SQLAlchemy models
        from_attributes = True 

class EquipeOut(Equipe_Base):
    class Config:
        # Ensures Pydantic models use attributes of SQLAlchemy models
        from_attributes = True
