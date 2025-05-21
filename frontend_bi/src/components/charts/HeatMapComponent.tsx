import { Typography } from "@mui/material"
import { NivoHeatmapSeriesRow } from "../../types/HeatMapTypes"
import { ResponsiveHeatMapCanvas } from "@nivo/heatmap"
import { getBasicColors, typedGetColor } from "../utils/heatmapColorUtils"
import GenericCellTooltip from "../utils/GenericCellTooltip "
import { GradientLegend } from "../utils/GradientLegend"
import { discreteItems } from "../utils/TeamsUtil"

interface HeatMapComponenetProps{
  heatMapTitle: string
  basicOnNormalizedOffColorMode: boolean
  minValue: string,
  maxValue: string,
  unitLabel?: string,
  pluralUnitForm?: boolean,
  mode: string,
  nivoData: NivoHeatmapSeriesRow[],
}

const HeatMapComponenet: React.FC<HeatMapComponenetProps>= ({
  heatMapTitle,  
  basicOnNormalizedOffColorMode,
  mode,
  nivoData,
  minValue,
  maxValue,
  unitLabel= '',
  pluralUnitForm= false,
}:any)=> (

<div style={{width:'100%', display:'flex', flexDirection:'column', paddingBottom:'35px'}}>
    <Typography style={{marginTop:'20px', width:'400px', marginLeft:'45px'}}variant="h6" align="center" gutterBottom>
        {heatMapTitle}
    </Typography>
    <div style={{width: '100%', height: 550}}>
      <ResponsiveHeatMapCanvas
      // how opaque the *hovered* cell stays
      activeOpacity={1}
      // how opaque the *other* cells become
      inactiveOpacity={0.6}
      hoverTarget="cell"
      data={nivoData}
      margin={{ top: 70, right: 60, bottom: 0, left: 100 }}
      colors={basicOnNormalizedOffColorMode? getBasicColors: typedGetColor(Number(minValue), Number(maxValue))}
      axisTop={{
        tickSize: 10,
        tickPadding: 5,
        legend: 'Semaines',
        legendOffset: -45,
        format: (tick: string) => {
          const number = parseInt(tick.replace(/\D/g, ''))
          return number % 2 === 0 ? tick : ''
        }
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        legend: 'Équipes',
        legendOffset: -45,
        format: teamName => String(teamName).slice(-1)
      }}

      theme={{
      axis: {
        legend: {
          text: {
            fontSize: 14,
          },
        },
        ticks: {
          text: {
            fontSize: 14,
          },
        },
      },
    }}
      enableLabels={false}
      tooltip={(props) =>
        <GenericCellTooltip
          {...props}  
          mode={mode}> 
        </GenericCellTooltip>
      }

      
      
      borderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
      
      isInteractive={true}
    />
    </div>

    { basicOnNormalizedOffColorMode? 
    <div style={{ marginTop:'5px', paddingTop:'0px', width:'100%', height:'50px', display: 'flex', justifyContent: 'center' }}>
      {discreteItems.map(item => (
        <div
          key={item.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: 16,
          }}
        >
          <span
            style={{
              width: 15,
              height: 12,
              background: item.color,
              display: 'inline-block',
            }}
          />
          <span style={{ marginLeft: 6, fontSize: 14 }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
    :
    <div style={{width:'100%'}}>
    <GradientLegend
        width={250}
        height={20}
        minLabel= {`${minValue} ${unitLabel}`}
        maxLabel= {`${maxValue} ${unitLabel}${pluralUnitForm? 's': ''}`}
  /></div>}
    

    </div>);

    export default HeatMapComponenet;