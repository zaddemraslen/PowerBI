// src/components/ProductionTable.tsx
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { ProductionFlat } from '../types/ProductionType';
import TableSortLabel from '@mui/material/TableSortLabel';

interface Column {
    id: string;
    label: string;
  }

interface Props {
  productions: ProductionFlat[];
  columns: Column[];
}

const getValue = (obj: any, path: string): any => {
    
    let x= path.split('.').reduce((acc, part) => acc?.[part], obj);
    //console.log("damn boy", x,"pppp", typeof x);
    return x;
};
  
const ProductionTable: React.FC<Props> = ({ productions, columns }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sortColumn, setSortColumn] = React.useState<string>('id_production');
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
    const columnWidths: (string | number)[] = [
        25, // width for column 0
        35, // width for column 1
        25,
        30,
        5,
        20,
        20,
        25, // etc. — match the number of columns
        20,
    ];

    const reorderedColumns = React.useMemo(() => {
        if (columns.length === 0) return [];
        return [columns[columns.length - 1], ...columns.slice(0, columns.length - 1)];
      }, [columns]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    
      const handleSort = (columnId: string) => {
        const isAsc = sortColumn === columnId && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortColumn(columnId);
      };

      const sortedData = [...productions].sort((a, b) => {
        const aValue = getValue(a, sortColumn);
        const bValue = getValue(b, sortColumn);
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      const paginatedData = sortedData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );

  return (
    <Paper elevation={3}>
        <TablePagination
        component="div"
        count={productions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
            paddingTop:0,
            }}
      />
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800, tableLayout: 'fixed', }} size="small" aria-label="production table">
            <TableHead>
            <TableRow >
                {reorderedColumns.map((col, index) => (
                <TableCell
                    key={col.id}
                    align="left"
                    sx={{ 
                        
                        fontWeight: 'bold',
                        width: columnWidths[index] || 'auto',
                    }}
                    sortDirection={sortColumn === col.id ? sortDirection : false}
                >
                    <TableSortLabel
                    active={sortColumn === col.id}
                    direction={sortColumn === col.id ? sortDirection : 'asc'}
                    onClick={() => handleSort(col.id)}
                    >
                    {col.label}
                    </TableSortLabel>
                </TableCell>
                ))}
            </TableRow>
            </TableHead>
            <TableBody>
            {paginatedData.map((row, rowIndex) => (
                <TableRow key={row.id_production || rowIndex}
                    sx={{
                        backgroundColor: rowIndex % 2 === 0 ? 'rgba(29, 57, 148, 0.3)' : 'rgba(60, 57, 57, 0.1)', // adjust opacity here
                        color: rowIndex % 2 === 0 ? 'rgb(228, 231, 239)' : 'inherit',
                        '&:hover': {
                        backgroundColor: rowIndex % 2 === 0 ? 'rgba(29, 57, 148, 0.2)' : 'rgba(60, 57, 57, 0.2)',
                        },
                    }}>
                {reorderedColumns.map((col, colIndex) => {
                    const value = getValue(row, col.id);
                    const displayValue =
                    typeof value === 'number' && !Number.isInteger(value)
                        ? value.toFixed(2)
                        : value;
                    console.log("colindex: ",colIndex,": ", columnWidths[colIndex])
                    return (
                    <TableCell
                        key={col.id}
                        align="left"
                        sx={{ width: columnWidths[colIndex] || 'auto' }}
                    >
                        {displayValue}
                    </TableCell>
                    );
                })}
                </TableRow>
            ))}
</TableBody>
        </Table>
        </TableContainer>
        <TablePagination
        component="div"
        count={productions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ProductionTable;
