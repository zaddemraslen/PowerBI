"""
ProductionModel defines the ORM mapping for the 'Production' table.

This model represents a production record in the system, which is linked to a specific command (Commande).
Each production record includes details about the product, quantities, costs, and the time taken to produce it.
It also has a foreign key linking to the corresponding Commande record.
"""

from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from app.database.database import Base 
from sqlalchemy.orm import relationship

class ProductionModel(Base):
    __tablename__ = "Production"

    # Primary key for the production record
    # This is a unique identifier for each production entry
    id_production = Column("ID_Production", Integer, primary_key=True, autoincrement=True, index=True)
    
    # The date on which the production was carried out
    date_production = Column("Date_Production", Date)
    
    # The name of the produced product (e.g., "Câblage Boeing 737")
    produit = Column("Produit", String)
    
    # The quantity of the product produced
    quantite = Column("Quantité", Integer)
    
    # The current status of the production (e.g., "In progress", "Completed")
    statut = Column("Statut", String)
    
    # The price per unit of the product
    prix_unitaire = Column("Prix_Unitaire", Float)
    
    # The total cost for the production process
    cout_production = Column("Coût_Production", Float)
    
    # The total time spent on the production process (in hours or minutes)
    temps_production = Column("Temps_Production", Float)

    # Foreign key to link this production record to a specific command (Commande)
    # This establishes a relationship between the Production and Commande tables
    id_commande = Column("ID_Commande", Integer, ForeignKey("Commande.ID_Commande"))

    # Relationship: Each production record is associated with one command (Commande)
    # The 'commande' attribute allows accessing the associated CommandeModel object for this production
    commande = relationship("CommandeModel")