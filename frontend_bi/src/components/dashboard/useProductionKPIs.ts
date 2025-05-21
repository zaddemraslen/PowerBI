import { ProductionFlat } from '../../types/ProductionType';

export function useProductionKPIs(productions: ProductionFlat[]) {
  const totalProdQuantity = productions.reduce((sum, p) => sum + (p.quantite || 0), 0);
  const prodTotalCost = productions.reduce((sum, p) => sum + (p.cout_production || 0), 0);
  const prodTotalRevenuePerUnit = productions.reduce((sum, p) => sum + ((p.prix_unitaire || 0) * (p.quantite || 0)), 0);
  const prodTotalTime = productions.reduce((sum, p) => sum + (p.temps_production || 0), 0);

  const prodCompletedCount = productions.filter(p => p.statut?.toLowerCase() === 'terminé').length;
  const prodInProgressCount = productions.filter(p => p.statut?.toLowerCase() === 'en cours').length;
  const prodPendingCount = productions.filter(p => p.statut?.toLowerCase() === 'en attente').length;

  const ProdStatusData = [
    { name: 'En cours', value: prodInProgressCount },
    { name: 'En attente', value: prodPendingCount },
    { name: 'Complet', value: prodCompletedCount }
  ];

  const ProdAverageProductionTime = totalProdQuantity > 0 ? prodTotalTime / totalProdQuantity : 0;
  const ProdAverageUnitCost = totalProdQuantity > 0 ? prodTotalCost / totalProdQuantity : 0;
  const prodAverageUnitPrice = productions.reduce((sum, p) => sum + (p.prix_unitaire || 0), 0) / productions.length;

  const productTotals: Record<string, number> = {};
  productions.forEach(p => {
    const name = p.produit || 'Inconnu';
    productTotals[name] = (productTotals[name] || 0) + (p.quantite || 0);
  });
  
  const mostProducedProduct = Object.entries(productTotals).reduce((max, curr) =>
    curr[1] > max[1] ? curr : max, ['', 0])[0];

  const productData = Object.entries(
    productions.reduce<Record<string, number>>((acc, p) => {
      const name = p.produit || 'Inconnu';
      acc[name] = (acc[name] || 0) + (p.quantite || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const averageProductData = productData.reduce((sum, item) => sum + item.value, 0) / productData.length;

  type Point = { idx: number; y: number; name: string, label: string };

  const costs: Point[] = [];
  const gains: Point[] = [];
  const revenues: Point[] = [];

  const productMap = new Map<string, { totalCost: number; totalRevenue: number }>();

  productions.forEach((p) => {
    const name = p.produit || 'Inconnu';
    const quantity = p.quantite || 0;
    const unitPrice = p.prix_unitaire || 0;
    const cost = p.cout_production || 0;
    const revenue = quantity * unitPrice;

    const existing = productMap.get(name) || { totalCost: 0, totalRevenue: 0 };
    existing.totalCost += cost;
    existing.totalRevenue += revenue;

    productMap.set(name, existing);
  });

  let index= 0
  for (const [name, { totalCost, totalRevenue }] of productMap.entries()) {
    const gain = totalRevenue - totalCost;
    costs.push({ idx: index, y: totalCost, name, label: 'Coût' });
    revenues.push({ idx: index, y: totalRevenue, name, label: 'Revenu' });
    gains.push({ idx: index, y: gain, name, label: 'Gain' });
    index++;
  }
  return {
    totalProdQuantity,
    prodTotalCost,
    prodTotalRevenue: prodTotalRevenuePerUnit,
    prodTotalTime,
    ProdStatusData,
    ProdAverageProductionTime,
    ProdAverageUnitCost,
    prodAverageUnitPrice,
    productData,
    averageProductData,
    prodCompletedCount,
    prodInProgressCount,
    prodPendingCount,
    prodCount: productions.length,
    mostProducedProduct,
    prodTotalRevenuePerUnit,
    costs,
    revenues,
    gains
  };
}
