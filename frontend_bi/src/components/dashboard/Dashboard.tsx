import React from 'react';
import { useFetchProductions } from '../../hooks/useFetchProductions';
import DashboardKPIs from './DashboardKPIs';
import { useFetchCommandes } from '../../hooks/useFetchCommandes';
import { useFetchEquipes } from '../../hooks/useFetchEquipes';
import { useFetchStocks } from '../../hooks/useFetchStocks';
import { CircularProgress, Box } from '@mui/material';
  
const Dashboard: React.FC = () => {
    const { data: prodData, loading: prodLoad, error:prodErr } = useFetchProductions();
    const { data: cmdData, loading: cmdLoad, error: cmdErr } = useFetchCommandes();
    const { data: eqData, loading: eqLoad, error: eqErr } = useFetchEquipes();
    const { data: stkData, loading: stkLoad, error: stkErr } = useFetchStocks();

  const [openError, setOpenError] = React.useState<boolean>(false); // Snackbar visibility
  const prodAvailable = prodData && prodData.length > 0;
  const cmdAvailable = cmdData && cmdData.length > 0;
  const eqAvailable = eqData && eqData.length > 0;
  const stkAvailable = stkData && stkData.length > 0;

  if (!prodAvailable || !cmdAvailable || !eqAvailable || !stkAvailable) {
    let availabilityMsg = '';
    if (!prodAvailable) availabilityMsg += '-- No productions data available. ';
    if (!cmdAvailable) availabilityMsg += '-- No orders data available.';
    if (!eqAvailable) availabilityMsg += '-- No equipes data available.';
    if (!stkAvailable) availabilityMsg += '-- No stocks data available.';

    return (
    <Box
      sx={{
        width: '100%',
        height: '635px', // approximate height of your final dashboard
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(228, 231, 239)',
      }}
    >
      <CircularProgress />
    </Box>);}
  return (
    <div style={{margin:0, marginLeft:'-10px',padding:0, width:"100%", backgroundColor:"rgb(228, 231, 239)"}}>
        <DashboardKPIs productions={prodData} commandes={cmdData} stocks={stkData} equipes={eqData}/>
    </div>
  );
};

export default Dashboard;