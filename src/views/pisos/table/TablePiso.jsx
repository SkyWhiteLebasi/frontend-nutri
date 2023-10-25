import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid, esES } from "@mui/x-data-grid";
import { GridToolbar } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import axios from "axios";
import ArgonBox from "components/ArgonBox";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PisoColumns } from './DataPiso';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import { Api_URL } from "config/Api_URL";
const URI = Api_URL + "pisos/";

const TablePiso = () => {
  const [Pisos, setPisos] = useState([]);

  const getPisos = async () => {
    try {
      const response = await axios.get(URI);
      setPisos(response.data);
    } catch (e) {
    }
  };

  const deletePiso = async (id) => {
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
          getPisos(res.data);
          Swal.fire('Eliminado', 'El piso del hospital ha sido eliminado correctamente', 'success');
        } catch (error) {
          Swal.fire('Error', 'Ha ocurrido un error al eliminar el piso seleccionado o no tiene permiso', 'error');
        }
      }
    });
  };

  useEffect(() => {
    getPisos();
  }, []);

  const memoizedPisos = useMemo(() => {
    return Pisos;
  }, [Pisos]);

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
  const hasUpdatePermission = sessionStorage.getItem("auth_permisos")?.includes("pisos.update");
  const hasDestroyPermission = sessionStorage.getItem("auth_permisos")?.includes("pisos.destroy");

  const actionColumn = [];

  if (hasUpdatePermission || hasDestroyPermission) {
    actionColumn.push({
      field: "opciones",
      headerName: "OPCIONES",
      display: 'flex',
      width: 270,
      // flex:1,
      renderCell: (params) => {
        return (

          <Stack direction="row" spacing={2}>
            {hasUpdatePermission && (
              <Button variant="outlined" startIcon={<EditIcon />} color="primary">
                <Link to={`form/${params.id}`} style={{ color: '#0481bb' }}>Editar</Link>
              </Button>
            )}
            {hasDestroyPermission && (
              <Button variant="outlined" onClick={() => deletePiso(params.id)} startIcon={<DeleteIcon />} color="warning">
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
      <div style={{ justifyContent: 'center' }}>
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
            sx={{ width: '100%' }}
            {...memoizedPisos}
            rows={memoizedPisos}
            columns={PisoColumns.concat(actionColumn)}
            components={{
              Toolbar: GridToolbar,
            }}
            initialState={{
              ...memoizedPisos.initialState,
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10, 25]} checkboxSelection
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        </ArgonBox>
      </div>
    </ThemeProvider >
  );
};

export default TablePiso;
