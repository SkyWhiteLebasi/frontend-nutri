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
import { PedidosDietasColumns } from './DataPedidoDietaProduccion';

const URI = Api_URL + "pedidodietasproduccion/"


const useStyles = makeStyles((theme) => ({
  tableContainer: {
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
    },
  },
}));

function TablePedidoDietaProduccion() {

  const [pedidos, setPedidoDietaProduccion] = useState([])
  const classes = useStyles();

  const getPedidoDietaProduccion = async () => {
    try {
      const response = await axios.get(URI)
      setPedidoDietaProduccion(response.data)
    } catch (e) {

    }
  }
  useEffect(() => {
    getPedidoDietaProduccion();
  }, [])


  const deletePedidoDietaProduccion = async (id) => {
    const res = await axios.delete(`${URI}${id}`)
    getPedidoDietaProduccion(res.data)
  }

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

  const hasUpdatePermission = sessionStorage.getItem("auth_permisos")?.includes("pedidodietasproduccion.update");
  const hasDestroyPermission = sessionStorage.getItem("auth_permisos")?.includes("pedidodietasproduccion.destroy");

  const actionColumn = [];

  if (hasUpdatePermission || hasDestroyPermission) {
    actionColumn.push({
      field: "opciones",
      headerName: "OPCIONES",
      display: 'flex',
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
              <Button variant="outlined" onClick={() => deletePedidoDietaProduccion(params.id)} startIcon={<DeleteIcon />} color="warning">
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
            //  loading={facultad.rows.length === 0}
            // rowHeight={38}
            rows={pedidos}
            columns={PedidosDietasColumns.concat(actionColumn)}
            pageSize={10}
            //rowsPerPageOptions={[5]}
            //getRowId={(row) => (row.id, row.updatedAt)}                     //checkboxSelection
            //disableColumnSelector

            components={{
              Toolbar: GridToolbar,
            }}

            //loading
            //{...stocks}

            // pageSizeOptions={[5, 10]}
            checkboxSelection
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        </ArgonBox>
      </div>
    </ThemeProvider>

  );
}

export default TablePedidoDietaProduccion;