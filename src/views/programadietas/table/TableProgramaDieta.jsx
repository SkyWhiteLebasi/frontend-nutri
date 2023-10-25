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
import { ProgramaDietasColumns } from './DataProgramaDieta';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import SearchIcon from '@mui/icons-material/Search';

// import "./style.scss";

import { Api_URL } from "config/Api_URL";
const URI = Api_URL + "programadietas/";

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

function TableProgramaDieta({ searchTerm, setSearchTerm }) {
  const [programaciones, setProgramaciones] = useState([]);
  const classes = useStyles();


    const getProgramaciones = async () => {
      try {
        const response = await axios.get(URI, {
          params: { searchTerm }, // Envía el término de búsqueda como parámetro en la solicitud
        });
        setProgramaciones(response.data);
      } catch (e) {
        // Manejar errores
      }
    };

  const deleteProgramaDieta = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`${URI}${id}`);
          getProgramaciones(res.data);
          Swal.fire('Eliminado', 'La programacion ha sido eliminado correctamente', 'success');
        } catch (error) {
          Swal.fire('Error', 'Ha ocurrido un error al eliminar la programacion seleccionada', 'error');
        }
      }
    });
  };
  useEffect(() => {
    getProgramaciones();
  }, []);
  const memoizedProgramacion = useMemo(() => {
    return programaciones;
  }, [programaciones]);

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

  const hasUpdatePermission = sessionStorage.getItem("auth_permisos")?.includes("programadietas.update");
  const hasDestroyPermission = sessionStorage.getItem("auth_permisos")?.includes("programadietas.destroy");

  const actionColumn = [];

  if (hasUpdatePermission || hasDestroyPermission) {
    actionColumn.push({
    field: "opciones",
    headerName: "OPCIONES",
    display: 'flex',
    width: 270,
    renderCell: (params) => {
      return (
        <Stack direction="row" spacing={2}>
               {hasUpdatePermission && (
          <Button variant="outlined" startIcon={<EditIcon />} color="primary">
            <Link to={`form/${params.id}`} style={{ color: '#0481bb' }}>Editar</Link>
          </Button>
          )}
            {hasDestroyPermission && (
          <Button variant="outlined" onClick={() => deleteProgramaDieta(params.id)} startIcon={<DeleteIcon />} color="warning">
            Eliminar
          </Button>
          )}
          </Stack>
        );
      },
    });
  }


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
          {/* <DataGrid
            rows={programaciones}
            columns={ProgramaDietasColumns.concat(actionColumn)}
            pageSize={10}
            components={{
              Toolbar: GridToolbar,
            }}
            checkboxSelection
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          /> */}
          <DataGrid
            {...memoizedProgramacion}
            rows={programaciones.filter((row) => {
              // Filtra las filas basadas en el término de búsqueda
              const nroSemana = typeof row.nro_semana === 'string' ? row.nro_semana : String(row.nro_semana);
              return (
                (nroSemana.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (row.fecha_programa.toLowerCase().includes(searchTerm.toLowerCase()))
              );
            })}
            columns={ProgramaDietasColumns.concat(actionColumn)}
            pageSize={10}
            components={{
              Toolbar: GridToolbar,
            }}
            initialState={{
              ...memoizedProgramacion.initialState,
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
};
TableProgramaDieta.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};
export default TableProgramaDieta;
