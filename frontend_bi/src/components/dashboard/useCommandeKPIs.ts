import { useMemo } from 'react';
import { Commande } from '../../types/CommandeType';

export function useCommandeKPIs(commandes: Commande[]) {    
  
    return useMemo(() => {
    const totalCmdOrders = commandes.length;

    const totalCmdOrderedQuantity = commandes.reduce(
      (sum, c) => sum + (c.quantite || 0),
      0
    );

    const cmdDeliveredCount = commandes.filter(
      (c) => c.statut?.toLowerCase() === 'livrée'
    ).length;

    const cmdPendingCount = totalCmdOrders - cmdDeliveredCount;

    const orderStatusData = [
      { name: 'En attente', value: cmdPendingCount },
      { name: 'Livré', value: cmdDeliveredCount },
    ];

    const clientData = Object.entries(
      commandes.reduce<Record<string, number>>((acc, c) => {
        const name = c.client || 'Inconnu';
        acc[name] = (acc[name] || 0) + (c.quantite || 0);
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));

    const clientCounts: Record<string, number> = {};
    commandes.forEach((c) => {
      const name = c.client || 'Inconnu';
      clientCounts[name] = (clientCounts[name] || 0) + 1;
    });

    const topClientbycmd = Object.entries(clientCounts).reduce(
      (max, curr) => (curr[1] > max[1] ? curr : max),
      ['', 0]
    )[0];

    const formatNumber = (n: number) =>
      n.toLocaleString(undefined, { maximumFractionDigits: 2 });

    const totalCmdQuantity = {
      label: 'Total Quantity Ordered',
      value: formatNumber(totalCmdOrderedQuantity),
    };

    const topClientbyOrder = {
      label: 'Top Client (by Order)',
      value: topClientbycmd,
    };

    return {
      totalCmdOrders,
      totalCmdOrderedQuantity,
      cmdDeliveredCount,
      cmdPendingCount,
      orderStatusData,
      clientData,
      topClientbycmd,
      topClientbyOrder,
      totalCmdQuantity,
    };
  }, [commandes]);
}
