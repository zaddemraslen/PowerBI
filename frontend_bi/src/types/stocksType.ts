export interface Stock {
  ID_Stock: number;
  Produit: string;
  Quantité_Disponible: number;
  Lieu_Stockage: string;
  Type_Matière: string;
  Mise_à_Jour: string; // or Date if you're converting it when consuming
}
