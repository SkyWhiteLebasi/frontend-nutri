import React, { useState, useEffect } from 'react';
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
import { Api_URL } from "config/Api_URL";
import Swal from "sweetalert2";
import { AlimentoColumns } from './DataAlimento';
// import "./style.scss";

const URI = Api_URL + "alimentos/";


const useStyles = makeStyles((theme) => ({
  tableContainer: {
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
    },
  },
}));

const TableAlimento = () => {
  const [alimentos, setAlimentos] = useState([]);
  const classes = useStyles();

  const getAlimentos = async () => {
    try {
      const response = await axios.get(URI);
      setAlimentos(response.data);
    } catch (e) {
      // Manejo del error
    }
  };

  const deleteAlimento = async (id) => {
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
          getAlimentos(res.data);
          Swal.fire('Eliminado', 'El alimento ha sido eliminado correctamente', 'success');
        } catch (error) {
          Swal.fire('Error', 'Ha ocurrido un error al eliminar el alimento', 'error');
        }
      }
    });
  };


  useEffect(() => {
    getAlimentos();
  }, []);

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

  // const actionColumn = {
  //   field: "opciones",
  //   headerName: "OPCIONES",
  //   display: 'flex',
  //   width: 270,
  //   renderCell: (params) => (
  //     <div className="cellAction">
  //       <Stack direction="row" spacing={2}>
  //         <Button variant="outlined" startIcon={<EditIcon />} color="primary">
  //           <Link to={`form/${params.id}`} style={{ color: '#0481bb' }}>Editar</Link>
  //         </Button>
  //         <Button variant="outlined" onClick={() => deleteAlimento(params.id)} startIcon={<DeleteIcon />} color="warning">
  //           Eliminar
  //         </Button>  //         <Button variant="outlined" onClick={() => deleteAlimento(params.id)} startIcon={<DeleteIcon />} color="warning">
  //           Eliminar
  //         </Button>
  //       </Stack>
  //     </div>
  //   ),
  // };


  const hasUpdatePermission = sessionStorage.getItem("auth_permisos")?.includes("alimentos.update");
  const hasDestroyPermission = sessionStorage.getItem("auth_permisos")?.includes("alimentos.destroy");

  const actionColumn = [];

  if (hasUpdatePermission || hasDestroyPermission) {
    actionColumn.push({
      field: "OPCIONES",
      headerName: "OPCIONES",
      width: 260,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2}>
            {hasUpdatePermission && (
              <Button variant="outlined" startIcon={<EditIcon />} color="primary">
                <Link to={`form/${params.id}`} style={{ color: '#0481bb' }}>Editar</Link>
              </Button>
            )}
            {hasDestroyPermission && (
              <Button variant="outlined" onClick={() => deleteAlimento(params.id)} startIcon={<DeleteIcon />} color="warning">
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
            rows={alimentos}
            columns={AlimentoColumns.concat(actionColumn)}
            pageSize={10}
            components={{
              Toolbar: GridToolbar,
            }}
            checkboxSelection
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        </ArgonBox>
      </div>
    </ThemeProvider>
  );
};

export default TableAlimento;
