import { interpolateTurbo } from "d3-scale-chromatic";

export const generateGradient = (steps = 10) => {
  const colors = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    colors.push(`${interpolateTurbo(t)} ${(t * 100).toFixed(0)}%`);
  }
  return `linear-gradient(to right, ${colors.join(', ')})`;
};

export const GradientLegend = ({
  width = 300,
  height = 20,
  minLabel = '0',
  maxLabel = '100',
}: {
  width?: number;
  height?: number;
  minLabel?: string;
  maxLabel?: string;
}) => {
  const gradientStyle = {
    width,
    height,
    background: generateGradient(20), // example colors; replace with your actual gradient
    borderRadius: 4,
    margin: '10px auto',
  };

  return (
    <div style={{ width: width + 40, margin: '0 auto', textAlign: 'center', fontSize: 14 }}>
      <div style={gradientStyle} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};