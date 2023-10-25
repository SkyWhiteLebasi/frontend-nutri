import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import Swal from 'sweetalert2'

import { Api_URL } from "config/Api_URL";

const Profile = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apel_paterno: "",
    apel_materno: "",
    email: "",
    password: "",
    error_list: [],
  });

  const [errors, setErrors] = useState({}); // Estado para almacenar los errores de validación
  const [errorMessages, setErrorMessages] = useState({});

  console.log(errors);
  useEffect(() => {
    // Hacer una solicitud GET para obtener los datos del perfil del usuario autenticado
    axios
      .get(Api_URL + "perfilUsuario")
      .then((response) => {
        const userData = response.data;
        // Llenar los campos del formulario con los datos del usuario
        setFormData({
          nombre: userData.nombre,
          apel_paterno: userData.apellido_paterno,
          apel_materno: userData.apellido_materno,
          email: userData.email,
          password: "", // Dejar este campo en blanco por razones de seguridad
        });
      })
      .catch((error) => {
        console.error("Error al obtener los datos del perfil:", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(Api_URL + "profile", formData);

      if (response.data.status === 200) {
        Swal.fire({
          title: "Editado con Exito..",
          // text: 'Presione Clik para cerrar!',
          icon: "success",
          timer: 5500,
        });
      }
      if (response.data.status === 500) {
        setErrorMessages(response.data.validation_errors);
      }
      // Realizar acciones adicionales después de la actualización si es necesario
    } catch (error) {
      if (error.response && error.response.status === 500) {
        // Si la respuesta tiene un estado 422 (Unprocessable Entity), significa que hubo errores de validación
        setErrorMessages(response.data.validation_errors);
      }
    }
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

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box textAlign="center" marginBottom={2}>
          <Typography variant="h5" gutterBottom>
            Actualizar Perfil
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box marginBottom={2}>
            <TextField
              label="Nombre"
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={(e) => {
                handleChange(e);
                setErrorMessages({ ...errorMessages, nombre: "" });
              }}
              fullWidth
            />
            <span>{errorMessages.nombre}</span>
          </Box>

          <Box marginBottom={2}>
            <TextField
              label="Apellido Paterno"
              type="text"
              id="apel_paterno"
              name="apel_paterno"
              value={formData.apel_paterno}
              onChange={(e) => {
                handleChange(e);
                setErrorMessages({ ...errorMessages, apel_paterno: "" });
              }}
              fullWidth
              required
            />
            <span>{errorMessages.apel_paterno}</span>
          </Box>

          <Box marginBottom={2}>
            <TextField
              label="Apellido Materno"
              type="text"
              id="apel_materno"
              name="apel_materno"
              value={formData.apel_materno}
              onChange={(e) => {
                handleChange(e);
                setErrorMessages({ ...errorMessages, apel_materno: "" });
              }}
              fullWidth
              required
            />
            <span>{errorMessages.apel_materno}</span>
          </Box>

          <Box marginBottom={2}>
            <TextField
              label="Email"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => {
                handleChange(e);
                setErrorMessages({ ...errorMessages, email: "" });
              }}
              fullWidth
            />
            <span>{errorMessages.email}</span>
          </Box>

          <Box marginBottom={2}>
            <TextField
              label="Contraseña"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                handleChange(e);
                setErrorMessages({ ...errorMessages, password: "" });
              }}
              fullWidth
            />

            <span>{errorMessages.password}</span>
          </Box>

          <Button type="submit" variant="contained" color="primary">
            Actualizar Perfil
          </Button>
        </form>
      </Container>
    </ThemeProvider>
  );
};

export default Profile;
