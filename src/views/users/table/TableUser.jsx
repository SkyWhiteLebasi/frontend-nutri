import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid, esES } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import axios from "axios";
import ArgonBox from "components/ArgonBox";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { makeStyles } from '@mui/styles'; // Importa makeStyles en lugar de styled
import { UsersColumns } from "./DataUser";
import Swal from "sweetalert2";
import { Api_URL } from "config/Api_URL";

import SearchIcon from '@mui/icons-material/Search';
import PropTypes from 'prop-types';

const URI = Api_URL + "users/";

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

function TableUser({ searchTerm, setSearchTerm }) {
  const [users, setUsers] = useState([]);
  const classes = useStyles();

  const getUsers = async () => {
    try {
      const response = await axios.get(URI);
      setUsers(response.data);
    } catch (e) { }
  };
  useEffect(() => {
    getUsers();
  }, []);

  const memoizedUsers = useMemo(() => {
    return users;
  }, [users]);

  const deleteUsers = async (id) => {
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
          getUsers(res.data);
          Swal.fire('Eliminado', 'El usuario ha sido eliminado correctamente', 'success');
        } catch (error) {
          Swal.fire('Error', 'Ha ocurrido un error al eliminar el usuario', 'error');
        }
      }
    });
  };

  const theme = createTheme({
    components: {
      MuiGridToolbar: {
        styleOverrides: {
          root: {
            backgroundColor: "red",
            color: "red",
          },
        },
      },
    },
  });

  const hasUpdatePermission = sessionStorage.getItem("auth_permisos")?.includes("users.update");
  const hasDestroyPermission = sessionStorage.getItem("auth_permisos")?.includes("users.destroy");

  const actionColumn = [];
  if (hasUpdatePermission || hasDestroyPermission) {
    actionColumn.push({
      field: "opciones",
      headerName: "OPCIONES",
      width: 620,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2}>
            {hasUpdatePermission && (
              <Button variant="outlined" startIcon={<EditIcon />} color="primary">
                <Link to={`form/${params.id}`} style={{ color: "#0481bb" }}>
                  Editar
                </Link>
              </Button>
            )}
            {hasDestroyPermission && (
              <Button
                variant="outlined"
                onClick={() => deleteUsers(params.id)}
                startIcon={<DeleteIcon />}
                color="warning"
              >
                Eliminar
              </Button>
            )}
            {hasDestroyPermission && (

              <Button variant="outlined" startIcon={<EditIcon />} color="primary">
                <Link to={`roles/${params.id}`} style={{ color: "#0481bb" }}>
                  Asignar
                </Link>
              </Button>
            )}
          </Stack>
        );
      },
    });
  }

  const filteredUsers = users.filter((user) => user.id >= 2);

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
            rows={filteredUsers}
            columns={UsersColumns.concat(actionColumn)}
            pageSize={10}
            components={{
              Toolbar: GridToolbar,
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          /> */}
          <DataGrid
            {...memoizedUsers}
            // rows={memoizedAmbientes}
            rows={users.filter((row) => {
              return (
                row.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.apel_paterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.apel_materno.toLowerCase().includes(searchTerm.toLowerCase())
                // row.categoria_producto.toLowerCase().includes(searchTerm.toLowerCase())
              );
            })}
            columns={UsersColumns.concat(actionColumn)}
            pageSize={15} // Change this to display 15 items per page
            components={{
              Toolbar: GridToolbar,
            }}
            initialState={{
              ...memoizedUsers.initialState,
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
TableUser.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};
export default TableUser;
