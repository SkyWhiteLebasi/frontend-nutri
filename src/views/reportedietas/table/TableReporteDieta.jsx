import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid, esES } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { makeStyles } from '@mui/styles'; // Importa makeStyles en lugar de styled
import ArgonBox from 'components/ArgonBox';
import ArgonTypography from 'components/ArgonTypography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import SearchIcon from '@mui/icons-material/Search'; 
import { ReporteDietasColumns } from './DataReporteDieta';
import { Api_URL } from "config/Api_URL";

const URI = Api_URL + "reporte_dietas/"

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      // Apply responsive styles for screen sizes smaller than 'sm'
      height: 'auto', // Set auto height for smaller screens
    },
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2), // Espacio inferior para separar el campo de búsqueda de la tabla
  },
  searchInput: {
    flex: 1,
    padding: theme.spacing(1),
    border: '1px solid #c8c6ba',
    borderRadius: '4px',
    fontSize: '16px',
    '& input:focus': { // Use '& input:focus' to target the input element when focused
      borderColor: 'blue',
    },
  },
}));
function TableReporteDieta({ searchTerm, setSearchTerm }) {
  const classes = useStyles();

  const [reportedietas, setReporteDietas] = useState([]);
  const getReporteDietas = async () => {
    try {
      const response = await axios.get(URI, {
        params: { searchTerm }, // Envía el término de búsqueda como parámetro en la solicitud
      });
      setReporteDietas(response.data);
    } catch (e) {
      // Manejar errores
    }
  };
  useEffect(() => {
    getReporteDietas();
  }, [])

  const memoizedReporteDietas = useMemo(() => {
    return reportedietas;
  }, [reportedietas]);

  const theme = createTheme({
    components: {
      MuiGridToolbar: {
        styleOverrides: {
          root: {
            backgroundColor: 'red',
            color: 'red',
          },
        },
      },
    },
  });


  return (
    <ThemeProvider theme={theme}>
      <div className={classes.tableContainer}>
        <div className={classes.searchContainer}>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={classes.searchInput}
            autoFocus
          />
          <SearchIcon style={{ color: '#888', marginLeft: '8px' }} /> {/* Agrega el icono de lupa */}
        </div>
        <ArgonBox
          sx={{
            '& .MuiTableRow-root:not(:last-child)': {
              '& td': {
                borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                  `${borderWidth[1]} solid ${borderColor}`,
              },
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'white',
              fontWeight: 900,
              border: '1px solid lightgray',
              color: '#035ba5',
            },
            '& .MuiDataGrid-row:nth-of-type(odd)': {
              backgroundColor: 'whitesmoke',
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: 'white',
            },
            '& .MuiDataGrid-cell': {
              padding: '8px',
            },
          }}
        >
        
          <DataGrid
            {...memoizedReporteDietas}
            rows={reportedietas.filter((row) => {
              // Filtra las filas basadas en el término de búsqueda
              return (
                (row.fecha_pedido.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (row.alimento.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (row.nombre_preparacion.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (row.total.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (row.pisos_pedido?.toLowerCase() || '').includes(searchTerm.toLowerCase())
              );
            })}
            columns={ReporteDietasColumns}
            pageSize={10}
            components={{
              Toolbar: GridToolbar,
            }}
            initialState={{
              ...memoizedReporteDietas.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25]}
            checkboxSelection
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        </ArgonBox>
      </div>
    </ThemeProvider>

  );
}

TableReporteDieta.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

export default TableReporteDieta;