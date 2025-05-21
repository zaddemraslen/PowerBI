export type NivoHeatmapSeriesRow = {
  id: string;
  data: { x: string; y: number }[];
};

export interface HeatmapDataPoint {
  x: number;   // day
  y: string;   // team
  value: number; // Disponibility:0 | 1 | 2 or effectif or number of working hours
}