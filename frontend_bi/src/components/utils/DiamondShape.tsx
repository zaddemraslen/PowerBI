import React from 'react';
 
interface DiamondShapeProps {
  cx?: number;
  cy?: number;
  fill?: string;
}

const DiamondShape: React.FC<DiamondShapeProps> = ({ cx = 0, cy = 0, fill = '#000' }) => {
    return (
        <path
            d={`M${cx},${cy - 6} L${cx + 6},${cy} L${cx},${cy + 6} L${cx - 6},${cy} Z`}
            stroke="none"
            fill={fill}
        />
    );
};

export default DiamondShape;