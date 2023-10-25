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
import { Link } from "react-router-dom";

const URI = Api_URL + "users/";

const Form = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombres, setNombres] = useState("");
  const [apellidosPaterno, setApellidosPaterno] = useState("");
  const [apellidosMaterno, setApellidosMaterno] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    if (id) {
      obtenerUsers();
    }
  }, []);

  const obtenerUsers = async () => {
    try {
      const response = await axios.get(`${URI}${id}`);
      console.log(response);
      setNombres(response.data.nombre);
      setApellidosPaterno(response.data.apel_paterno);
      setApellidosMaterno(response.data.apel_materno);
      setEmail(response.data.email);
      setPassword(response.data.password);
    } catch (error) {
      console.error(error);
    }
  };

  /* const handleSubmit = async (event) => {
       event.preventDefault();
       await axios.post(URI, {
         nombre_ambiente: nombreAmbientes,
       });
     };*/
  const handleSubmit_1 = async (event) => {
    try {
      event.preventDefault();

      if (id) {
        const response = await axios.put(`${URI}${id}`, {
          nombre: nombres,
          apel_paterno: apellidosPaterno,
          apel_materno: apellidosMaterno,
          email: email,
          password: password,
        });
        if (response.status === 200) {
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
      } else {
        const response = await axios.post(URI, {
          nombre: nombres,
          apel_paterno: apellidosPaterno,
          apel_materno: apellidosMaterno,
          email: email,
          password: password,
        });
        if (response.status === 200) {
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
            <ArgonBox mb={2}>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Nombres:
              </Typography>

              <ArgonInput
                value={nombres}
                onChange={(event) => {
                  setNombres(event.target.value);
                  setErrorMessages({ ...errorMessages, nombre: "" });
                }}
              />
              <span>{errorMessages.nombre}</span>
            </ArgonBox>
            <ArgonBox mb={2}>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Apellido Paterno:
              </Typography>

              <ArgonInput
                value={apellidosPaterno}
                onChange={(event) => {
                  setApellidosPaterno(event.target.value);
                  setErrorMessages({ ...errorMessages, apel_paterno: "" });
                }}
              />
              <span>{errorMessages.apel_paterno}</span>
            </ArgonBox>
            <ArgonBox mb={2}>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Apellido Materno:
              </Typography>

              <ArgonInput
                value={apellidosMaterno}
                onChange={(event) => {
                  setApellidosMaterno(event.target.value);
                  setErrorMessages({ ...errorMessages, apel_materno: "" });
                }}
              />
              <span>{errorMessages.apel_materno}</span>
            </ArgonBox>
            <ArgonBox mb={2}>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Correo Electronico:
              </Typography>

              <ArgonInput
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrorMessages({ ...errorMessages, email: "" });
                }}
              />
            </ArgonBox>
            <span>{errorMessages.email}</span>

            <ArgonBox mb={2}>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Contraseña:
              </Typography>

              <ArgonInput
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrorMessages({ ...errorMessages, password: "" });
                }}
              />
              <span>{errorMessages.password}</span>
            </ArgonBox>
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
                type="submit"
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

export default Form;
