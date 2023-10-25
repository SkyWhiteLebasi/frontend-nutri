import * as React from "react";

import { useState } from "react";

// @mui material components
import Switch from "@mui/material/Switch";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";

import Button from "@mui/material/Button";

// Authentication layout components
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";

// Image

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

import { Api_URL } from "config/Api_URL";
import ImgFondo from "./Arequipa.jpg";
import FormUser from "views/users/form/FormUser";
import Users from "views/users/User";

import axios from "axios";
const URI = Api_URL + "login";

function Logins() {
  const [rememberMe, setRememberMe] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const navigate = useNavigate();
  const [loginInput, setLogin] = useState({
    email: "",
    password: "",
    error_list: [],
  });

  const handleInput = (e) => {
    e.persist();
    setLogin({ ...loginInput, [e.target.name]: e.target.value });
  };
  const loginSubmit = (e) => {
    e.preventDefault();

    const data = {
      email: loginInput.email,
      password: loginInput.password,
    };

    axios.get("/sanctum/csrf-cookie").then((response) => {
      axios.post(URI, data).then((res) => {
        if (res.data.status === 200) {
          sessionStorage.setItem("auth_token", res.data.token);
          sessionStorage.setItem("auth_name", res.data.username);
          sessionStorage.setItem("auth_rol", res.data.roles);
          sessionStorage.setItem("auth_permisos", res.data.permissions);
          navigate("/dashboard");
          window.location.reload();
        } else if (res.data.status === 404) {
          setLogin({ ...loginInput, error: res.data.message });
        } else if (res.data.status === 401) {
          setLogin({ ...loginInput, error: res.data.message });
        } else {
          setLogin({
            ...loginInput,
            error_list: res.data.validation_errors,
          });
        }
      });
    });
  };
  //ver y ocultar password
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <IllustrationLayout
      title="Login"
      description="Iniciar Sesion"
      illustration={{
        image: ImgFondo,
        title: "SISTEMA DE NUTRICION - ESSALUD",
        subtitle: "SEGURO SOCIAL DE SALUD",
        description: "Sistema de Control de Procesos",
      }}
    >
      <ArgonBox component="form" role="form" onSubmit={loginSubmit}>
        <span>{loginInput.error}</span>

        <ArgonBox mb={2}>
          <ArgonInput
            type="email"
            value={loginInput.email}
            onChange={handleInput}
            name="email"
            placeholder="Email"
            size="large"
          />
          <span>{loginInput.error_list.email}</span>
        </ArgonBox>

        <ArgonBox mb={2}>
          <ArgonInput
            name="password"
            onChange={handleInput}
            value={loginInput.password}
            placeholder="Contraseña"
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
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
          <span>{loginInput.error_list.password}</span>
        </ArgonBox>

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
          <ArgonButton color="info" type="submit" size="large" fullWidth>
            Iniciar Sesion
          </ArgonButton>
        </ArgonBox>

        <Button
          variant="outlined"
          color="info"
          size="large"
          fullWidth
          onClick={() => {
            navigate("/register");
          }}
          style={{
            color: "#000000",
            // border: 'none',
          }}
        >
          Registrarse
        </Button>
      </ArgonBox>
    </IllustrationLayout>
  );
}

export default Logins;
