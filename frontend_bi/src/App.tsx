// src/App.tsx
import React, { useEffect, useState } from 'react';
import { fetchData } from './api';
import './App.css'
const App: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      setData(result);
      setLoading(false);
    };
    
    getData();
  }, []);

  return (
    <div>
      <h1>Backend API Data yes</h1>
      {loading ? <p>Loading...</p> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default App;
