import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"

//const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1'];
const defaultColors = [
  '#1a10e4', '#048636', '#d76406', '#524ea6', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c', '#d0ed57', '#8dd1e1'
];
type PieDataItem = {
  name: string;
  value: number;
};


interface PieChartProps{
    PieData: PieDataItem[];
    outerRadiusflag: any | null
  };

const PieChartFigure: React.FC<PieChartProps>= ({PieData, outerRadiusflag}) =>{
  
  return(
      <ResponsiveContainer width="100%" height= {outerRadiusflag ==null? "90%":"80%"} >
                <PieChart>
                  <Pie
                    data={PieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={outerRadiusflag== null? 70 : 80}
                    innerRadius={40}
                    label
                    style={{backgroundColor: 'red'}}
                  >
                    {PieData.map((_, index) => (
                      <Cell
                        key={`client-${index}`}
                        fill={defaultColors[index % defaultColors.length]}
                      />
                    ))}
                  </Pie>

                    <Legend height={30}/>
                  
                </PieChart>
      </ResponsiveContainer>
    )
  }

  export default PieChartFigure; 