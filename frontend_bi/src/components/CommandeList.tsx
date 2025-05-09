// src/components/ProductionList.tsx
import React from 'react';
import { useFetchCommandes } from '../hooks/useFetchCommandes';
import CommandeTable from './CommandeTable';
import { CircularProgress , Box, Snackbar, Alert} from '@mui/material';

const CommandeList: React.FC = () => {
  const { data, loading, error } = useFetchCommandes();
  const [openError, setOpenError] = React.useState<boolean>(false); // Snackbar visibility

  if (loading) return <Box 
    sx={{
        width: '100%',
        minWidth: '100vw',
        height: '400px', // adjust height to match your table area
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgb(228, 231, 239)',
        borderRadius:'4px',
    }}>
        <CircularProgress size={180}/>
    </Box>;

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
          {`Error fetching commands data: ${error}`}
        </Alert>
      </Snackbar>
    );
  }

  // Dynamically get the column names from the first production item
  const columns = data.length > 0
    ? Object.keys(data[0]).map((key) => ({
        id: key,
        label: key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
      }))
    : [];   
      
  return (
    <div>
      <CommandeTable commandes={data} columns={columns}/>
    </div>
  );
};

export default CommandeList;
