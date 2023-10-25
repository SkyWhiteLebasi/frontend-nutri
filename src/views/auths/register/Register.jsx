/**
=========================================================
* Argon Dashboard 2 MUI - v3.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { useState, useEffect } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";

// Authentication layout components
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";

//import InputLabel from '@mui/material/InputLabel';
//import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom'

import { Api_URL } from 'config/Api_URL';
import axios from 'axios';
import ImgFondo from './login.jpg'
import Card from "@mui/material/Card";

import { styled } from "@mui/material/styles";

import { Button, Box } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import PropTypes from "prop-types";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import Popper from "@mui/material/Popper";
import { useTheme } from "@mui/material/styles";
import { VariableSizeList } from "react-window";
import Typography from "@mui/material/Typography";
import { ListSubheader } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import { Divider } from "@mui/material";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
// import Box from '@mui/material/Box';
import Swal from "sweetalert2";

// Image
const bgImage =
  "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg";

const URI = Api_URL + "register/";
const URI2 = Api_URL + "roles/";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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

function Register() {
  const [rememberMe, setRememberMe] = useState(false);
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  // const [roles, setRoles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectRol, setSelectRol] = useState("")
  console.log(roles);
  const navigate = useNavigate()

  const [registerInput, setRegister] = useState({
    nombre: "",
    apel_paterno: '',
    apel_materno: '',
    email: '',
    password: '',
    // selectedRole: '',
    error_list: [],

  });
  const [selectedRole, setSelectedRole] = useState("");
  useEffect(() => {
    // Realiza una solicitud a tu API Laravel para obtener la lista de roles
    getRoles();
  }, []);
  //console.log(RegisterInput)
  const getRoles = async () => {
    const response = await axios.get(URI2);
    setRoles(response.data);
  };

  const handleInput = (e) => {
    e.persist();
    setRegister({ ...registerInput, [e.target.name]: e.target.value })
  }
  const RegisterSubmit = (e) => {
    e.preventDefault();

    const data = {
      nombre: registerInput.nombre,
      apel_paterno: registerInput.apel_paterno,
      apel_materno: registerInput.apel_materno,
      email: registerInput.email,
      password: registerInput.password,
      role: selectRol,
    };

    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.post(URI, data).then(res => {
        if (res.data.status === 200) {
          sessionStorage.setItem('auth_token', res.data.token);
          sessionStorage.setItem('auth_name', res.data.username);
          sessionStorage.setItem('auth_rol', res.data.roles);
          sessionStorage.setItem('auth_permisos', res.data.permissions);
          navigate('/dashboard')
          window.location.reload();
        } if (res.data.status === 500) {
          setRegister({ ...registerInput, error_list: res.data.validation_errors })
        }
      });
    });

  }

  //ver y ocultar password
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <IllustrationLayout
      title="Registrarse"
      description="Ingrese los siguientes campos requeridos"
      illustration={{
        image: ImgFondo,
        title: "SISTEMA DE NUTRICION - ESSALUD",
        subtitle: "SEGURO SOCIAL DE SALUD",
        description: "Sistema de Control de Procesos",
      }}
    >
      <ArgonBox component="form" role="form" onSubmit={RegisterSubmit}>

        <ArgonBox mb={2}>
          <ArgonInput type="text" name='nombre' onChange={handleInput} value={registerInput.nombre} placeholder="Nombre" size="large" />
          <span>{registerInput.error_list.nombre}</span>
        </ArgonBox>

        <ArgonBox mb={2}>
          <ArgonInput type="text" name='apel_paterno' onChange={handleInput} value={registerInput.apel_paterno} placeholder="Apellido Paterno" size="large" />
          <span>{registerInput.error_list.apel_paterno}</span>
        </ArgonBox>
        <ArgonBox mb={2}>
          <ArgonInput type="text" name='apel_materno' onChange={handleInput} value={registerInput.apel_materno} placeholder="Apellido Materno" size="large" />
          <span>{registerInput.error_list.apel_materno}</span>
        </ArgonBox>
        <ArgonBox mb={6}>
          <Item>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Seleccione el Rol:
            </Typography>

            <Autocomplete
              value={
                selectRol
                  ? roles.find((option) => {
                      return selectRol === option.name;
                    }) ?? null
                  : null
              }
              onChange={(event, newValue) => {
                setSelectRol(newValue ? newValue.name : null);
              }}
              disablePortal
              sx={{ width: "100%", height: "100%" }}
              disableListWrap
              PopperComponent={StyledPopper}
              ListboxComponent={ListboxComponent}
              options={roles}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} />}
              renderOption={(props, option, state) => [props, option.name, state.index]}
              // renderOption={(props, option, state) => [props,  , option.id + " " + option.nombre_ambiente]}
              renderGroup={(params) => params}
            />
          </Item>
          
        </ArgonBox>
        <ArgonBox mb={2}>
          <ArgonInput type="text" name='email' onChange={handleInput} value={registerInput.email} placeholder="Email" size="large" />
          <span>{registerInput.error_list.email}</span>
        </ArgonBox>
        <ArgonBox mb={2}>
          <ArgonInput
            name='password'
            onChange={handleInput}
            value={registerInput.password}
            placeholder="Contraseña"
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            size="large"
          />
          <span>{registerInput.error_list.password}</span>
        </ArgonBox>

        {/* <ArgonBox mb={2}>
          <ArgonInput
            onChange={handleInput}
            value={RegisterInput.password}
            placeholder="Confirmar Contraseña"
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            size="large"
          />

        </ArgonBox>
      */}

        <ArgonBox display="flex" alignItems="center">
          <Switch checked={rememberMe} onChange={handleSetRememberMe} />
          <ArgonTypography
            variant="button"
            fontWeight="regular"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            &nbsp;&nbsp;Recordar
          </ArgonTypography>
        </ArgonBox>

        <ArgonBox mt={4} mb={1}>
          <ArgonButton type={"submit"} color="info" size="large" fullWidth>
            Registrarse
          </ArgonButton>
        </ArgonBox>

      </ArgonBox>


    </IllustrationLayout>
  );
}

export default Register;
