import { colors } from "./heatmapColorUtils";

// 0 = Occupée (red), 1 = Partielle (orange), 2 = Disponible (green)
export const discreteItems = [
  { label: 'Occupée', color: colors[0] },
  { label: 'Partielle', color: colors[1] },
  { label: 'Disponible', color: colors[2] },
];