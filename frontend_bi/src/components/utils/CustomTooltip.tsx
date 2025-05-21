import React from 'react';

interface DataPoint {
  idx: number;
  y: number;
  name: string;
  label: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  CustomTooltipInfo: DataPoint[][]
  unit?: string
  integerFlag?: boolean
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, CustomTooltipInfo, unit, integerFlag }: any) => {
  // const Colors_variant1= ['#8884d8', '#82ca9d', '#ff7300']
  const colors=['#1a10e4', '#048636', '#d76406','#8884d8', '#82ca9d', '#ff7300']

  if (active && payload && payload.length > 0) {
    const { idx, name } = payload[0]?.payload || {};
    if  (typeof idx === 'undefined') return null;
  return (
      <div style= {{ backgroundColor: 'white', border: '1px solid #ccc', padding: 10, paddingTop:5, marginTop:5, minWidth:'170px' }}>
        <div style={{fontStyle:'italic', marginBottom:'0px', textAlign: 'center'}}>
          <p>{name ?? 'no name'}</p>
        </div>
        {
          CustomTooltipInfo.map((infoList: any, i: any) => {
            const dataPoint = infoList.find((dp: any) => Number(dp.idx) === Number(idx));
            if (!dataPoint) return <p>undefined</p>;
            
            const displayFlag =
          integerFlag
            ? dataPoint.y !== 0
            : dataPoint.y !== 0.0;
            
            if (!displayFlag) return null;
            return(
            <div 
              key={i}
              style={{ margin: '0', marginTop:'0px', padding:'0', height:'25px', display:'flex', justifyContent:'space-between'}}>
              <p style={{fontStyle:'normal', fontWeight:'bold', marginTop:'0px', color:colors[i % colors.length]}}>{dataPoint.label}:</p>
              <p style={{fontStyle:'normal', fontWeight:'bold', marginTop:'0px', color:colors[i % colors.length]}}>{integerFlag===true? Math.round(dataPoint.y) : dataPoint.y.toFixed(2)}{unit}</p>
            </div>
          );})}
          
      </div>
    );
  }
  return null;
};



export default CustomTooltip;