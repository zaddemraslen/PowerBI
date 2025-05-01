"""
CommandeModel defines the ORM mapping for the 'Commande' table.

This model represents customer orders, with fields such as client name,
ordered product, quantity, status, and date of the order.
"""
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from app.database.database import Base 
from sqlalchemy.orm import relationship

class CommandeModel(Base):
    __tablename__ = "Commande"

    # Primary key: Unique identifier for each commande
    id_commande = Column("ID_Commande", Integer, primary_key=True, index=True)

    # Name of the client who placed the order
    client = Column("Client", String)

    # Quantity of the product ordered
    produit_commande = Column("Produit_commandé", String)
    
    # Quantity of the product ordered
    quantite = Column("Quantité", Integer)
    
    # Status of the order (e.g., En cours, Livrée)
    statut = Column("Statut", String)
    
    # Date when the order was placed
    date_commande = Column("Date_Commande", Date)