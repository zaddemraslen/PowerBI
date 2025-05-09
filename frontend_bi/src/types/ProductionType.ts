
import { Commande } from './CommandeType';

export interface ProductionFlat {
    id_production: number;
    date_production: string;
    id_commande: number;
    produit: string;
    quantite: number;
    statut: string;
    prix_unitaire: number;
    cout_production: number;
    temps_production: number;
  }

  export interface Production {
    id_production: number;
    date_production: string
    commande?: Commande;
    produit: string;
    quantite: number;
    statut: string;
    prix_unitaire: number;
    cout_production: number;
    temps_production: number;
  }