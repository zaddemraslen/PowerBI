import { interpolateTurbo } from 'd3-scale-chromatic';
import { ComputedCell } from '@nivo/heatmap'; 

export const colors = ['#d32f2f', '#ff9800', '#4caf50']; 

export const getBasicColors = (cell: { value: number | null }) =>
    colors[cell.value ?? 0];

export const getNormalizedColor =
  (minValue: number, maxValue: number) =>
  (cell: { value: number | null }): string => {
    if (cell.value === null) return '#eeeeee';
    const normalized = (cell.value - minValue) / (maxValue - minValue);
    return interpolateTurbo(normalized);
  };

  export const typedGetColor = (minValue: number= 0, maxValue: number= 100) => {
    const normalizedColor= getNormalizedColor(minValue, maxValue)
    return (
      cell: Omit<ComputedCell<{ x: string; y: number }>, 'borderColor' | 'color' | 'opacity' | 'labelTextColor'>):
    string => {
      return normalizedColor({ value: cell.value });
    };
  };