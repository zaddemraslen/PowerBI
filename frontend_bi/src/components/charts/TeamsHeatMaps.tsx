import { useState } from 'react';
import { HeatmapDataPoint } from '../../types/HeatMapTypes';
import {
  buildTeamMap,
  teamMapToNivoData,
  getMinMax,
  getRoundedRange } from '../utils/nivoDataTransform';
import HeatMapComponenet from './HeatMapComponent';

interface HeatMapChartsProps {
  Availabilitydata: HeatmapDataPoint[],
  WorkHoursdata: HeatmapDataPoint[],
  Staffdata: HeatmapDataPoint[]
}

const HeatMapCharts = ({ Availabilitydata, WorkHoursdata, Staffdata}: HeatMapChartsProps) => {
  const [hoveredCell, setHoveredCell] = useState<{ x: string; y: string } | null>(null);

  const A_teamMap = buildTeamMap(Availabilitydata);
  const WH_teamMap = buildTeamMap(WorkHoursdata);
  const S_teamMap = buildTeamMap(Staffdata);

  const A_nivoData = teamMapToNivoData(A_teamMap);
  const WH_nivoData = teamMapToNivoData(WH_teamMap);
  const S_nivoData = teamMapToNivoData(S_teamMap);

  const [minWHnivoData, maxWHnivoData] = getMinMax(WH_nivoData);
  const [minSnivoData, maxSnivoData] = getMinMax(S_nivoData);

  const roundedRangeWH = getRoundedRange(minWHnivoData, maxWHnivoData);
  const roundedRangeS = getRoundedRange(minSnivoData, maxSnivoData);

  return (
    <div style={{display:'flex', flexDirection:'row', justifyContent:'center', gap:'0px', width:'100%'}}>
      <HeatMapComponenet
        heatMapTitle= 'Carte thermique de la disponibilité hebdomadaire des équipes'
        basicOnNormalizedOffColorMode= {true}
        minValue={(-Infinity).toString()}
        maxValue={Infinity.toString()}
        mode='availability'
        nivoData={A_nivoData}
        >
      </HeatMapComponenet>
      <HeatMapComponenet
        heatMapTitle='Carte thermique de l’activité horaire hebdomadaire par équipe'
        basicOnNormalizedOffColorMode= {false}
        minValue={roundedRangeWH[0].toString()}
        maxValue={roundedRangeWH[1].toString()}
        unitLabel= 'h'
        mode='workHours'
        nivoData={WH_nivoData}
        >
      </HeatMapComponenet>
      <HeatMapComponenet
        heatMapTitle={'Carte thermique de la répartition hebdomadaire de l’effectif par équipe'}
        basicOnNormalizedOffColorMode= {false}
        minValue={roundedRangeS[0].toString()}
        maxValue={roundedRangeS[1].toString()}
        unitLabel= 'membre'
        pluralUnitForm= {true}
        mode='staff'
        nivoData={S_nivoData}
        >
      </HeatMapComponenet>
    </div>
  );
};

export default HeatMapCharts;