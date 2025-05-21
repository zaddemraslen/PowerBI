import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Legend,
} from 'recharts';
import CustomTooltip from '../utils/CustomTooltip';

interface dataPoint {
    label: string;
    totalQuantity: number;
}

type Props = {
  data: Array<{ label: string; [key: string]: number | string }>;
  locations: string[];
  totalStockByMaterial: dataPoint[];
  colors?: string[];
};

const defaultColors = [
  '#1a10e4', '#048636', '#d76406', '#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c', '#d0ed57', '#8dd1e1'
];

const StockQuantityBarChart: React.FC<Props> = ({ data, locations, colors = defaultColors, totalStockByMaterial}) => {
    const mergedData = useMemo(() => {
  const totalMap = Object.fromEntries(
    totalStockByMaterial.map(({ label, totalQuantity }) => [label, totalQuantity])
  );

  return data.map((d, idx) => {
    const { label, ...rest } = d; // ✅ Correct destructuring
    return {
      ...rest,
      name: label,
      totalQuantity: totalMap[label] ?? 0,
      idx,
    };
  }) as Array<{ [key: string]: number | string } & { totalQuantity: number; idx: number }>;
  }, [data, totalStockByMaterial]);


    const tooltipData = useMemo(() => {
    return locations.map(location =>
      mergedData.map((item) => ({
        name: String(item.label),
        label: location,
        y: Number(item[location] ?? 0),
        idx: item.idx
      }))
    );
  }, [mergedData, locations]);

    // Custom label renderer for total quantity
    const renderTotalLabel = (props: any) => {
        const { x, y, width, height, value } = props;
        
        return (
        <text
            x={x + width + 5}
            y={y + 12}
            fill="#000"
            fontWeight="normal"
            textAnchor="start"
            dominantBaseline="middle"
        >
            {value}
        </text>
        );
    };

    return (
    <div style={{ width: '100%', height: '273px', padding:'0px', paddingRight:'5px'}}>
      <ResponsiveContainer style={{marginLeft:'-20px', paddingLeft:'0px'}} width="90%" height="95%">
        <BarChart
          layout="vertical"
          data={mergedData}
          margin={{ top: 20, right: 50, left: 100, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={120} />
          <Tooltip content={<CustomTooltip CustomTooltipInfo={tooltipData} integerFlag={true}></CustomTooltip>}/>
          <Legend />
          {locations.map((location, index) => (
            
            <Bar
              key={location}
              dataKey={location}
              stackId="stack"
              fill={colors[index % colors.length]}
              barSize={25}
            >
                {index === locations.length-1 && (
                <LabelList
                dataKey="totalQuantity"
                content={renderTotalLabel}></LabelList>)}
            </Bar>
            ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockQuantityBarChart;