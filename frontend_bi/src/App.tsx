// src/App.tsx
import React, { useEffect, useState } from 'react';
import { fetchData } from './api/api';
import './styles/App.css'
import { Tab, Tabs, Box } from '@mui/material';
import ProductionList from './components/ProductionList';
import CommandeList from './components/CommandeList';
import EquipesList from './components/EquipesList';
import StockList from './components/StockList';
import Dashboard from './components/dashboard/Dashboard';
const App: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // Load tabIndex from localStorage or default to 0
  const [tabIndex, setTabIndex] = useState<number>(() => {
    const storedIndex = localStorage.getItem('selectedTabIndex');
    return storedIndex !== null ? parseInt(storedIndex, 10) : 0;
  });

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      setData(result);
      setLoading(false);
    };
    getData();
  }, []);

  // Handle tab change and save selected index
  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
    localStorage.setItem('selectedTabIndex', newIndex.toString());
  };

  return (
    <div style={{backgroundColor:"yellow", width: "90%", padding:"0", margin:"0"}}>
      <Box sx={{
        width: '110%',
        height: "100%",
        backgroundColor: 'rgb(228, 231, 239)',
        margin: "0",
        marginTop:
        tabIndex === 0 ? '0px' :
        tabIndex === 1 ? '-130px' :
        tabIndex === 2 ? '-165px' :
        tabIndex === 3 ? '-130px' :
        tabIndex === 4 ? '-150px' :
        '0px', // default fallback
        padding:"0px"}}
      >
        <Tabs sx={{margin:0, marginLeft:2, padding:0, width:'100%'}} value={tabIndex} onChange={handleTabChange} aria-label="production tabs">
          <Tab label="Tableau de bord" />
          <Tab label="Production" />
          <Tab label="Commandes" />
          <Tab label="Équipes" />
          <Tab label="Stockage" />
        </Tabs>
        <Box sx={{ padding: 2, paddingTop:0, margin:0, marginTop:0, backgroundColor: "rgb(228, 231, 239)", width:'97.35%' }}>
          {tabIndex === 0 && <Dashboard/>}
        </Box>
        <Box sx={{ padding: 2, paddingTop:0, margin:0, marginTop:-2, backgroundColor: "rgb(228, 231, 239)", width:'97.35%' }}>
          {tabIndex === 1 && <ProductionList/>}
        </Box>
        <Box sx={{ padding: 2, paddingTop:0, margin:0, marginTop:0,backgroundColor: "rgb(228, 231, 239)", width:'97.35%' }}>
          {tabIndex === 2 && <CommandeList/>}
        </Box>
        <Box sx={{ padding: 2, paddingTop:0, margin:0, marginTop:-4, backgroundColor: "rgb(228, 231, 239)", width:'97.35%' }}>
          {tabIndex === 3 && <EquipesList/>}
        </Box>
        <Box sx={{ padding: 2, paddingTop:0, margin:0, marginTop:-2,backgroundColor: "rgb(228, 231, 239)", width:'97.35%' }}>
          {tabIndex === 4 && <StockList/>}
        </Box>
      </Box>
      </div>
  );
}
export default App;