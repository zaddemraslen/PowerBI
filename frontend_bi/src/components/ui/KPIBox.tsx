import React from 'react';
import { Typography } from '@mui/material';

interface KPI {
  label: string;
  value: string | number;
}

interface KPIBoxProps {
  kpis: KPI[];
  finalRightBorderFlagOff: boolean;
  style?: React.CSSProperties;
}

const KPIBox: React.FC<KPIBoxProps> = ({ kpis , finalRightBorderFlagOff, style}) => {
  
  if (!kpis || kpis.length === 0) {
    return (
      <div
        style={{
          padding: '20px',
          margin: '10px',
          backgroundColor: '#fff',
          borderRadius: '5px',
          boxShadow:
            '0px 3px 5px -1px rgb(228, 231, 239), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
        }}
      >
        <Typography variant="subtitle1" align="center" color="textSecondary">
          No KPIs available to display.
        </Typography>
      </div>
    );
  }
  
    return (
    <div
      style={{
        boxShadow:
          '0px 3px 5px -1px rgb(228, 231, 239), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
        //padding: '0px',
        backgroundColor: 'white',
        //marginBottom: '10px',
        marginLeft: '10px',
        width: '100%',
        display: 'flex',
        //marginTop: 65,
        borderRadius: '3px',
        ...style
      }}
    >
      {kpis.map((kpi, index) => (
        <div
          key={index}
          style={{
            padding: '0px',
            margin: '0px',
            marginLeft: '15px',
            marginRight: '10px',
            paddingBottom: '10px',
            paddingTop: '15px',
            borderRight:
              index !== kpis.length - 1 || finalRightBorderFlagOff=== false
                ? '3px solid rgba(15, 15, 15, 0.3)'
                : 'none',
            paddingRight: '15px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" gutterBottom>
            {kpi.label}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            {kpi.value}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default KPIBox;
