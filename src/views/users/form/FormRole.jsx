import React, { useState, useEffect } from "react";

import ArgonBox from "components/ArgonBox";
import Card from "@mui/material/Card";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Button, Box } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import { Divider } from "@mui/material";

import Swal from "sweetalert2";

import { Api_URL } from "config/Api_URL";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import Popper from "@mui/material/Popper";
import { useTheme } from "@mui/material/styles";
import { VariableSizeList } from "react-window";
import { ListSubheader } from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import ClearIcon from "@mui/icons-material/Clear";
import CardContent from "@mui/material/CardContent";

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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
/*incio del componente autocomplete*/
const LISTBOX_PADDING = 20; // px

function renderRow(props) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: style.top + LISTBOX_PADDING,
  };

  if (dataSet.hasOwnProperty("group")) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  return (
    <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
      {`#${dataSet[2] + 1} - ${dataSet[1]}`}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData = [];
  children.forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 26 : 38;

  const getChildSize = (child) => {
    if (child.hasOwnProperty("group")) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});
const URI = Api_URL + "users/";
const URI1 = Api_URL + "roles";
const URI2 = Api_URL + "permisos";
const URI3 = Api_URL + "usersrolper/";

const FormRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [listroles, setListRoles] = useState([]);
  const [listpermisos, setLisPermisos] = useState([]);

  const getListRoles = async () => {
    const response = await axios.get(URI1);
    //console.log(response.data)
    setListRoles(response.data);
  };
  const getLisPermisos = async () => {
    const response = await axios.get(URI2);
    //console.log(response.data)
    setLisPermisos(response.data);
  };

  const [listadeUser, setListaDeUser] = useState("");

  const obtenerUsers = async () => {
    try {
      const response = await axios.get(`${URI3}${id}`);
      console.log(response);
      // setRoles(response.data.roles);
      setRoles(response.data.roles.map((roles) => roles.id));
      // setPermissions(response.data.permissions);
      setPermissions(response.data.permissions.map((permissions) => permissions.id));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (id) {
      obtenerUsers();
      getListRoles();
      getLisPermisos();
    }
  }, []);

  const handleSubmit_1 = async (event) => {
    try {
      event.preventDefault();

      if (id) {
        const response = await axios.put(`${URI}${id}${"/assign-roles-and-permissions"}`, {
          roles: roles,
          permissions: permissions,
        });
        if (response.status === 200) {
          Swal.fire({
            title: "Editado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
        }
        if (response.status === 500) {
          Swal.fire({
            title: "Error Revise los datos...",
            // text: 'Presione Clik para cerrar!',
            icon: "warning",
            timer: 5500,
          });
        }
      } else {
    
      }

      navigate("/usuarios");

      //setNombreAmbientes('');
    } catch (error) {
      console.error(error);
    }
  };

  const CustomButton = styled(Button)(({ theme }) => ({
    "&:hover": {
      backgroundColor: "green", // Reemplaza 'new color' por el color deseado para el hover
    },
  }));

  return (
    <div style={{ justifyContent: "center" }}>
      <Card variant="outlined" sx={{ maxWidth: 750, display: "flex", margin: "0 auto" }}>
        <ArgonBox p={1} mb={1} textAlign="center">
          {/* <ArgonTypography variant="h5" fontWeight="medium">
                    Registrar Ambiente
                </ArgonTypography> */}
          <CardHeader title="REGISTRAR USUARIOS" />
        </ArgonBox>
        {/* <hr color='#11cdef' size='8px'/> */}
        <Divider sx={{ my: -1.5, backgroundColor: "lightdark", height: 4 }} />

        <ArgonBox pt={2} pb={3} px={5}>
          <ArgonBox component="form" role="form" onSubmit={handleSubmit_1}>
            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Rol:
                </Typography>
                <Autocomplete
                  multiple
                  value={roles ? listroles.filter((option) => roles.includes(option.id)) : []}
                  /* value={idPersonal.length > 0 ? idPersonal.map((personal) => ({
                      id: personal.id,
                      nobre_personal: personal.nombre_personal
                    })) : []}*/
                  onChange={(event, newValues) => {
                    const newSelectedIds = newValues.map((newValue) => newValue.id);
                    setRoles(newSelectedIds);
                  }}
                  disablePortal
                  sx={{ width: "100%", height: "100%" }}
                  disableListWrap
                  PopperComponent={StyledPopper}
                  ListboxComponent={ListboxComponent}
                  options={listroles}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => <TextField {...params} />}
                  renderOption={(props, option, state) => [props, option.name, state.index]}
                  renderGroup={(params) => (
                    <li {...params}>
                      <strong>{params.key}</strong>
                    </li>
                  )}
                />
              </Item>
            </Grid>

            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Permisos:
                </Typography>
                <Autocomplete
                  multiple
                  value={
                    permissions
                      ? listpermisos.filter((option) => permissions.includes(option.id))
                      : []
                  }
                  /* value={idPersonal.length > 0 ? idPersonal.map((personal) => ({
                      id: personal.id,
                      nobre_personal: personal.nombre_personal
                    })) : []}*/
                  onChange={(event, newValues) => {
                    const newSelectedIds = newValues.map((newValue) => newValue.id);
                    setPermissions(newSelectedIds);
                  }}
                  disablePortal
                  sx={{ width: "100%", height: "100%" }}
                  disableListWrap
                  PopperComponent={StyledPopper}
                  ListboxComponent={ListboxComponent}
                  options={listpermisos}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => <TextField {...params} />}
                  renderOption={(props, option, state) => [props, option.name, state.index]}
                  renderGroup={(params) => (
                    <li {...params}>
                      <strong>{params.key}</strong>
                    </li>
                  )}
                />
              </Item>
            </Grid>
            <ArgonBox display="flex" justifyContent="center" mt={4} mb={2}>
              <CustomButton
                px={1}
                type="submit"
                variant="contained"
                sx={{
                  color: {
                    background: "#f2762e",
                    color: "white",
                    width: "25%",
                    display: "flex",
                    justifyContent: "center",
                  },
                  "&:hover": {
                    backgroundColor: "#d25c26", // Reemplaza 'new color' por el color deseado para el hover
                  },
                  marginRight: "10px",
                }}
                fullWidth
              >
                Guardar
              </CustomButton>
              <CustomButton
                px={1}
                variant="contained"
                sx={{
                  color: {
                    background: "#058bbe",
                    color: "white",
                    width: "25%",
                    display: "flex",
                    justifyContent: "center",
                  },
                  "&:hover": {
                    backgroundColor: "#0a7eb4", // Reemplaza 'new color' por el color deseado para el hover
                  },
                }}
                fullWidth
              >
                <Link to={"/Usuarios"} style={{ color: "white" }}>
                  Cancelar
                </Link>{" "}
              </CustomButton>
            </ArgonBox>
            <ArgonBox mt={2}>
              <ArgonTypography variant="button" color="text" fontWeight="regular">
                <i>*Revise los datos antes de guardar&nbsp;*</i>
              </ArgonTypography>
            </ArgonBox>
          </ArgonBox>
        </ArgonBox>
      </Card>
    </div>
  );
};

export default FormRole;
