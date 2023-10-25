import React, { useState, useEffect } from 'react';
import { DataGrid, esES } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { makeStyles } from '@mui/styles'; // Importa makeStyles en lugar de styled
import ArgonBox from 'components/ArgonBox';
import { createTheme, ThemeProvider } from '@mui/material/styles';


import { ProductoSalidaReporteColumns } from './DataProductoSalidaReporte';


import { Api_URL } from "config/Api_URL";
const URI = Api_URL + "productosalidareporte/"


const useStyles = makeStyles((theme) => ({
  tableContainer: {
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
    },
  },
}));

function TableProductoSalidaReporte() {

  const [productoReporte, setProductoReporte] = useState([])
  const classes = useStyles();

  const getProductoReporte = async () => {
    try {
      const response = await axios.get(URI)
      setProductoReporte(response.data)
    } catch (e) {

    }
  }
  useEffect(() => {
    getProductoReporte();
  }, [])




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
            rows={productoReporte}
            columns={ProductoSalidaReporteColumns}
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

export default TableProductoSalidaReporte;