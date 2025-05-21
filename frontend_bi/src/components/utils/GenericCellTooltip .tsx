import { TooltipProps  } from "@nivo/heatmap";

interface GenericCellTooltipProps extends TooltipProps<{ x: string; y: number }>{
    mode: TooltipMode;
    }

    type TooltipMode = 'availability' | 'workHours' | 'staff';

    const colors = ['#d32f2f', '#ff9800', '#4caf50']; 
    // 0 = Occupée (red), 1 = Partielle (orange), 2 = Disponible (green)
    

  const GenericCellTooltip = ({ cell, mode }: GenericCellTooltipProps) => {
  const team = cell.serieId;
  const day = cell.data.x;
  const val = cell.value ?? 0;

  let content: React.ReactNode = null;

  switch (mode) {
    case 'availability':
      content = (
        <p style={{ marginTop: '0px', marginBottom: '5px', color: colors[val] }}>
          {['Occupée', 'Partielle', 'Disponible'][val]}
        </p>
      );
      break;

    case 'workHours':
      content = (
        <p style={{ marginTop: '0px', marginBottom: '5px' }}>{val}h</p>
      );
      break;

    case 'staff':
      content = (
        <p style={{ marginTop: '0px', marginBottom: '5px' }}>
          {val} Membre{val >= 2 ? 's' : ''}
        </p>
      );
      break;

    default:
      content = <p>Valeur inconnue</p>;
  }

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #ccc',
      padding: 10,
      paddingTop: 5,
      marginTop: 5,
      width: '150px'
    }}>
      <div style={{
        fontStyle: 'italic',
        display: 'flex',
        justifyContent: 'space-around',
        height: '25px'
      }}>
        <p style={{ marginTop: '0px' }}>Équipe:</p>
        <p style={{ marginTop: '0px' }}>Semaine:</p>
      </div>
      <div style={{
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-around',
        height: '25px'
      }}>
        <p style={{ marginTop: '0px' }}>{team.slice(-1)}</p>
        <p style={{ marginTop: '0px' }}>{day}</p>
      </div>
      <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
        {content}
      </div>
    </div>
  );
};

export default GenericCellTooltip;