import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import PieChartFigure from '../charts/PieChartFigure';

interface Props {
  title: string,
  subtitle: string | null,
  info: any,
  data: any[]
  InfoVspace: number| null
  style?: React.CSSProperties;
}

const PieChartCard: React.FC<Props> = ({ info, title, data, InfoVspace, style }) =>
{
  return( 
    <div
  style={{
    marginTop:'10px',
    marginLeft: '10px',
    padding: 0,
    paddingLeft: '5px',
    paddingRight: '5px',
    height: '335px',
    borderRadius: '8px',
    ...style,
  }}
>
  <div
    style={{
      paddingLeft: 10,
      paddingRight: 10,
      height: '300px',
      display: 'flex',
      flexDirection: 'column',
      
    }}
  >
    <div
      style={{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.25rem', // similar to Typography variant="h6"
        marginBottom: '8px',
      }}
    >
      {title}
    </div>

    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        padding: 0,
        height: '270px',
      }}
    >
      <div
        style={{
          width: '100%',
          minWidth: 250,
          marginTop:'0px',
          height: 260,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: InfoVspace == null ? '45%' : `${InfoVspace}%`,
            transform: 'translateX(-50%)',
            padding: '5px 10px',
            borderRadius: '8px',
            zIndex: 0,
          }}
        >
          <div
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              whiteSpace: 'pre-line',
              fontSize: '1rem', // subtitle1
            }}
          >
            {`Total\n${info}`}
          </div>
        </div>

        <PieChartFigure outerRadiusflag={null} PieData={data} />
      </div>
    </div>
  </div>
</div>)
}

export default PieChartCard;