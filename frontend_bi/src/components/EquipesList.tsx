// src/components/ProductionList.tsx
import React from 'react';
import { useFetchEquipes } from '../hooks/useFetchEquipes';
import EquipesTable from './equipesTable';
import { CircularProgress , Box, Snackbar, Alert} from '@mui/material';

const EquipesList: React.FC = () => {
  const { data, loading, error } = useFetchEquipes();
  const [openError, setOpenError] = React.useState<boolean>(false); // Snackbar visibility


  if (loading) {return(<Box
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
      </Box>);};

// If error occurs, show error Snackbar
if (error) {
    return (
      <Snackbar
        open={openError} // Control visibility based on state
        onClose={() => setOpenError(false)} // Close when done
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000} // Auto hide after 6 seconds
      >
        <Alert severity="error" onClose={() => setOpenError(false)} sx={{ width: '100%' }}>
          {`Error fetching équipes data: ${error}`}
        </Alert>
      </Snackbar>
    );
  }

  // Dynamically get the column names from the first production item
  const columns = data.length > 0
    ? Object.keys(data[0]).map((key) => ({
        id: key,
        label: key
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      }))
    : [];   
      
  return (
    <div style={{width:"100%", height:'500px', backgroundColor:'rgba(rgb(228, 231, 239))'}}>
      <EquipesTable equipes={data} columns={columns}/>
    </div>
  );
};

export default EquipesList;
