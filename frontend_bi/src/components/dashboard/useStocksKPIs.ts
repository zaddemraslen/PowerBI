import { useMemo } from 'react';
import { Stock } from '../../types/stocksType';

export function useStocksPIs(stocks: Stock[])
{
    const totalStockKPI = useMemo(() => {
    const total = stocks.reduce((sum, s) => sum + (s.Quantité_Disponible || 0), 0);
    return {
      label: 'Total Stock Quantity',
      value: total.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    };
  }, [stocks]);
///////////////////////////
  const stockByLocationDonutData = useMemo(() => {
    const map: Record<string, number> = {};
    stocks.forEach(s => {
      const location = s.Lieu_Stockage || 'Inconnu';
      map[location] = (map[location] || 0) + (s.Quantité_Disponible || 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [stocks]);
////////////////////////////////
  const stockByMaterialBarData = useMemo(() => {
    const locationSet = new Set<string>();
    const materialMap: Record<string, Record<string, number>> = {};
    const totalByMaterialMap: Record<string, number> = {};

    stocks.forEach(s => {
        const type = s.Type_Matière || 'Inconnu';
        const location = s.Lieu_Stockage || 'Inconnu';
        const quantity = s.Quantité_Disponible || 0;

        locationSet.add(location);

        if (!materialMap[type]) {
        materialMap[type] = {};
        }

        materialMap[type][location] = (materialMap[type][location] || 0) + quantity;

      // accumulate total quantity per material
      totalByMaterialMap[type] = (totalByMaterialMap[type] || 0) + quantity;
    });

    const locations = Array.from(locationSet);
    const data= Object.entries(materialMap).map(([material, locationQuantities]) => ({
        label: material,
        ...locationQuantities,
    }));

    // Build array of totals per material, aligned by label
    const totalStockByMaterial = data.map(d => ({
      label: d.label,
      totalQuantity: totalByMaterialMap[d.label] || 0,
    }));

    return { data, locations, totalStockByMaterial };
    }, [stocks]);
  ////////////////////////////////////////////
  return {
        totalStockKPI: totalStockKPI,
        stockByLocationDonutData: stockByLocationDonutData,
        stockByMaterialBarData: stockByMaterialBarData.data,
        stockBarLocations: stockByMaterialBarData.locations,
        totalStockByMaterial: stockByMaterialBarData.totalStockByMaterial
  };
}
