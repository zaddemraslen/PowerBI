import { useMemo } from 'react';
import { Equipe } from '../../types/EquipesType';

interface HeatmapAvailabilityDataPoint {
  x: number; // day label
  y: string; // team name
  value: number; // availability score
}

interface HeatmapWorkHoursDataPoint {
  x: number; // day label
  y: string; // team name
  value: number; // Working hours
}

interface HeatmapStaffDataPoint {
  x: number; // day label
  y: string; // team name
  value: number; // Staff
}

export function useEquipesKPIs(equipes: Equipe[]) {
  return useMemo(() => {
    const uniqueTeamNames = Array.from(new Set(equipes.map(e => e.Nom_Équipe)));
    const countTeam = uniqueTeamNames.length;

    const availabilityMap: Record<string, number> = {
      "Disponible": 2,
      "Partielle": 1,
      "Occupée": 0,
    };

    const heatmapDataAvailability: HeatmapAvailabilityDataPoint[] = equipes.map((equipe) => {
      const day = Math.floor((equipe.ID_Équipe - 1) / countTeam) + 1;
      const value = availabilityMap[equipe.Disponibilité] ?? 0;

      return {
        x: Math.round(day),
        y: equipe.Nom_Équipe,
        value,
      };
    });

    const heatmapDataWorkHours: HeatmapWorkHoursDataPoint[] = equipes.map((equipe) => {
      const day = Math.floor((equipe.ID_Équipe - 1) / countTeam) + 1;
      const value = equipe["Nombre_Heures_Travaillées"] ?? 0;

      return {
        x: Math.round(day),
        y: equipe.Nom_Équipe,
        value,
      };
    });

    const heatmapDataStaff: HeatmapStaffDataPoint[] = equipes.map((equipe) => {
      const day = Math.floor((equipe.ID_Équipe - 1) / countTeam) + 1;
      const value = equipe.Effectif ?? 0;

      return {
        x: Math.round(day),
        y: equipe.Nom_Équipe,
        value,
      };
    });
return { 
  heatmapDataAvailability: heatmapDataAvailability,
  heatmapDataWorkHours: heatmapDataWorkHours,
  heatmapDataStaff: heatmapDataStaff
 };
  }, [equipes]);
}
