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
import Swal from 'sweetalert2';
import { Api_URL } from "config/Api_URL";
import { ServiciosColumns } from './DataServicio';


const useStyles = makeStyles((theme) => ({
  tableContainer: {
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      // Apply responsive styles for screen sizes smaller than 'sm'
      height: 'auto', // Set auto height for smaller screens
    },
  },
}));

const URI = Api_URL + 'servicios/';

const TableServicio = () => {
  const [servicio, setServicio] = useState([]);
  const classes = useStyles(); // Get the custom styles

  const getServicio = async () => {
    try {
      const response = await axios.get(URI);
      setServicio(response.data);
    } catch (error) {
      // Handle the error here or log it if needed.
      console.error('Error fetching Servicio:', error);
    }
  };

  const deleteServicio = async (id) => {
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
          getServicio(res.data);
          Swal.fire('Eliminado', 'El servicio ha sido eliminado correctamente', 'success');
        } catch (error) {
          Swal.fire('Error', 'Ha ocurrido un error al eliminar el servicio', 'error');
        }
      }
    });
  };

  useEffect(() => {
    getServicio();
  }, []);

  const memoizedServicios = useMemo(() => {
    return servicio;
  }, [servicio]);

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
  const hasUpdatePermission = sessionStorage.getItem("auth_permisos")?.includes("servicios.update");
  const hasDestroyPermission = sessionStorage.getItem("auth_permisos")?.includes("servicios.destroy");

  const actionColumn = [];
  if (hasUpdatePermission || hasDestroyPermission) {
    actionColumn.push({
      field: 'opciones',
      headerName: 'OPCIONES',
      width: 260,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2}>
            {hasUpdatePermission && (
              <Button variant="outlined" startIcon={<EditIcon />} color="primary">
                <Link to={`form/${params.id}`} style={{ color: '#0481bb' }}>
                  Editar
                </Link>
              </Button>
            )}
            {hasDestroyPermission && (
              <Button
                variant="outlined"
                onClick={() => deleteServicio(params.id)}
                startIcon={<DeleteIcon />}
                color="warning"
              >
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
      <div className={classes.tableContainer}> {/* Apply the custom styles here */}
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
            {...memoizedServicios}
            autoHeight // Set autoHeight to true for responsive behavior
            rows={servicio}
            columns={ServiciosColumns.concat(actionColumn)}
            pageSize={10}
            components={{
              Toolbar: GridToolbar,
            }}
            initialState={{
              ...memoizedServicios.initialState,
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

export default TableServicio;