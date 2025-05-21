import { NivoHeatmapSeriesRow, HeatmapDataPoint } from "../../types/HeatMapTypes";

export function buildTeamMap(data: HeatmapDataPoint[]): Record<string, Record<string, number>> {
  const teamMap: Record<string, Record<string, number>> = {};
  data.forEach(({ x, y, value }) => {
    if (!teamMap[y]) teamMap[y] = {};
    teamMap[y][x.toString()] = value;
  });
  return teamMap;
}

export function teamMapToNivoData(teamMap: Record<string, Record<string, number>>): NivoHeatmapSeriesRow[] {
  return Object.entries(teamMap).map(([team, daysMap]) => ({
    id: team,
    data: Object.entries(daysMap).map(([day, value]) => ({
      x: day,
      y: value,
    })),
  }));
}


export function getMinMax(nivoData: NivoHeatmapSeriesRow[]): [number, number] {
  let min = Infinity;
  let max = -Infinity;

  nivoData.forEach(row => {
    row.data.forEach(({ y }) => {
      if (y < min) min = y;
      if (y > max) max = y;
    });
  });

  return [min, max];
}

export function getRoundedRange(min: number, max: number): [number, number] {
  const range = max - min;
  let step = 10;

  if (range < 50) step = 5;
  else if (range < 200) step = 10;
  else if (range < 1000) step = 50;
  else step = 100;

  const roundedMin = Math.floor(min / step) * step;
  const roundedMax = Math.ceil(max / step) * step;

  return [roundedMin, roundedMax];
}