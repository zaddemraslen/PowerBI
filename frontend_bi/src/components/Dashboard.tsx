import React from 'react';
import { useFetchProductions } from '../hooks/useFetchProductions';
import DashboardKPIs from './DashboardKPIs';
import { useFetchCommandes } from '../hooks/useFetchCommandes';
import { blue } from '@mui/material/colors';
  
const Dashboard: React.FC = () => {
    const { data: prodData, loading: prodLoad, error:prodErr } = useFetchProductions();
    const { data: cmdData, loading: cmdLoad, error: cmdErr } = useFetchCommandes();
  const [openError, setOpenError] = React.useState<boolean>(false); // Snackbar visibility

  return (
    <div style={{margin:0, marginLeft:'-10px',padding:0, width:"100%", backgroundColor:"rgb(228, 231, 239)"}}>
        <DashboardKPIs productions={prodData} commandes={cmdData}/>
    </div>
  );
};

export default Dashboard;
