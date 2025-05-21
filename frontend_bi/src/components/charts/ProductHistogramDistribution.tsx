import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import CustomTooltip from '../utils/CustomTooltip';

interface DataPoint {
  name: string;
  value: number;
}

interface ProductQuantityHistogramDistributionPropos {
  averageProductData: number;
  productData: DataPoint[];
}

const ProductQuantityHistogramDistribution: React.FC<ProductQuantityHistogramDistributionPropos> = ({averageProductData, productData}) => {
  const tooltipData = [
  productData.map((item, idx) => ({
    name: item.name,
    y: item.value,
    idx,
    label: "Quantité"
  }))
  ];
  
  return (
    <div style={{ margin: 0, padding: 0, width: '100%', height: 300 }}>
      <div style={{ width: '100%', height: '25px' }}>
        {/* Custom Legend ABOVE the chart */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 12,
            marginBottom: 10,
          }}
        >
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              gap: 16,
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            <li
              key="item-0"
              style={{ color: '#524ea6', display: 'flex', alignItems: 'center' }}
            >
              <span
                style={{
                  marginRight: 6,
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  backgroundColor: '#524ea6',
                }}
              />
              Quantité
            </li>
            <li
              key="avg-line"
              style={{ color: 'rgb(106, 62, 62)', display: 'flex', alignItems: 'center' }}
            >
              <span
                style={{
                  marginRight: 6,
                  display: 'inline-block',
                  width: 30,
                  height: 1.5,
                  backgroundImage:
                    'repeating-linear-gradient(to right, rgb(106, 62, 62), rgb(106, 62, 62) 4px, transparent 4px, transparent 8px)',
                }}
              />
              Moyenne = {averageProductData.toFixed(2)}
            </li>
          </ul>
        </div>
      </div>

      <ResponsiveContainer width="95%" height="100%" style={{ paddingLeft: 10, paddingRight: 10 }}>
        <BarChart data={tooltipData[0]} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
          <XAxis
            dataKey="name"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 10, fontStyle: 'italic' }}
          />
          <YAxis />
          <RechartsTooltip content={<CustomTooltip CustomTooltipInfo={tooltipData} integerFlag={true}/>} />
          <Bar dataKey="y" fill="#524ea6" barSize={120} />
          <ReferenceLine y={averageProductData} stroke="rgb(78, 43, 43)" strokeDasharray="4 4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductQuantityHistogramDistribution;
