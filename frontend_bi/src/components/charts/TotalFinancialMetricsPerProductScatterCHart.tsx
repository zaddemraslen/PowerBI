import { Tooltip, CartesianGrid, Legend, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from "recharts"
import CustomTooltip from "../utils/CustomTooltip"
import DiamondShape from "../utils/DiamondShape"
import React from "react";

type Point = { idx: number; y: number; name: string, label: string };

interface TotalFinancialMetricsPerProductProps{
    costs: Point[],
    revenues: Point[],
    gains: Point[],
}
const TotalFinancialMetricsPerProduct: React.FC<TotalFinancialMetricsPerProductProps> = ({costs, revenues, gains}: any)=>{
const colors=['#1a10e4', '#048636', '#d76406']
  return(
  <div style={{ margin:0, padding:0, width: '100%' ,height: 260 }}>
                <ResponsiveContainer width={'100%'} height={250}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="idx" name="Index" />
                    <YAxis type="number" dataKey="y" name="Value" />
                    <Tooltip content={<CustomTooltip CustomTooltipInfo={[costs, revenues, gains]} unit="$"/>}
                      cursor={{ strokeDasharray: '3 3'  }}
                    />
                    <Legend />
                    
                    <Scatter name="Cost" data={costs} fill={colors[0]} shape={<DiamondShape />}/>
                    <Scatter name="Revenue" data={revenues} fill={colors[1]} shape={<DiamondShape />}/>
                    <Scatter name="Gain" data={gains} fill={colors[2]} shape={<DiamondShape />}/>
                  </ScatterChart>
                </ResponsiveContainer>
  </div>
  )}

  export default TotalFinancialMetricsPerProduct;