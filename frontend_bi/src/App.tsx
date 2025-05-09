// src/App.tsx
import React, { useEffect, useState } from 'react';
import { fetchData } from './api/api';
import './styles/App.css'
import { Tab, Tabs, Box } from '@mui/material';
import ProductionList from './components/ProductionList';
import CommandeList from './components/CommandeList';
import Dashboard from './components/Dashboard';
const App: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      setData(result);
      setLoading(false);
    };
    getData();
  }, []);

  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <div style={{backgroundColor:"yellow", width: "98%", padding:"0", margin:"0"}}>
      <Box sx={{ width: '100%', height: "500px", backgroundColor: 'rgb(228, 231, 239)', margin: "0", marginTop: -10, padding:"0"}}>
        <Tabs sx={{margin:0, marginLeft:2, padding:0, width:'100%'}} value={tabIndex} onChange={handleTabChange} aria-label="production tabs">
          <Tab label="Dashboard" />
          <Tab label="Production Data" />
          <Tab label="Commande Data" />
        </Tabs>
        <Box sx={{ padding: 2, paddingTop:0, margin:0, marginTop:-0, backgroundColor: "rgb(228, 231, 239)", width:'97.35%' }}>
          {tabIndex === 0 && <Dashboard/>}
          {/* You can add more components inside their respective tabs */}
        </Box>
        <Box sx={{ padding: 2, paddingTop:0, margin:0, marginTop:-2, backgroundColor: "rgb(228, 231, 239)", width:'97.35%' }}>
          {tabIndex === 1 && <ProductionList/>}
          {/* You can add more components inside their respective tabs */}
        </Box>
        <Box sx={{ padding: 2, paddingTop:0, margin:0, marginTop:-2,backgroundColor: "rgb(228, 231, 239)", width:'97.35%' }}>
          {tabIndex === 2 && <CommandeList/>}
          {/* You can add more components inside their respective tabs */}
        </Box>
      </Box>
      </div>
  );
}
export default App;
