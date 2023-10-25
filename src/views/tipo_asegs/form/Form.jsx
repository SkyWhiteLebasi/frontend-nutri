import React, { useState, useEffect } from "react";

import ArgonBox from "components/ArgonBox";
import Card from "@mui/material/Card";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";

import { styled } from "@mui/material/styles";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import CardHeader from "@mui/material/CardHeader";
import { Divider } from "@mui/material";
import Swal from "sweetalert2";
import { Api_URL } from "config/Api_URL";
import Typography from "@mui/material/Typography";

const URI = Api_URL + "tipo_asegs/";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const Form = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errorList, setErrorList] = useState({});
  //   const [nombreAmbientes, setNombreAmbientes] = useState('');
  const [codTipAseg, setCodTipSeg] = useState("");
  const [destipseg, setDesTipSeg] = useState("");

  useEffect(() => {
    if (id) {
      //   obtenerAmbiente();
      getTipAseg();
    }
  }, []);

  const getTipAseg = async () => {
    try {
      const response = await axios.get(`${URI}${id}`);
      //   setNombreAmbientes(response.data.nombre_ambiente);
      setCodTipSeg(response.data.codtipseg);
      setDesTipSeg(response.data.destipseg);
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
          //   nombre_ambiente: nombreAmbientes,
          codtipseg: codTipAseg,
          destipseg: destipseg,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Editado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/tipo_asegs");
        }
      } else {
        const response = await axios.post(URI, {
          //   nombre_ambiente: nombreAmbientes,
          codtipseg: codTipAseg,
          destipseg: destipseg,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Creado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/tipo_asegs");
        }
      }

      //setNombreAmbientes('');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.validation_errors) {
        setErrorList(error.response.data.validation_errors);
      }
    }
  };

  const CustomButton = styled(Button)(({ theme }) => ({
    "&:hover": {
      backgroundColor: "green", // Reemplaza 'new color' por el color deseado para el hover
    },
  }));

  return (
    <Card>
      <ArgonBox p={1} mb={1} textAlign="center">
        {/* <ArgonTypography variant="h5" fontWeight="medium">
                    Registrar Personal
                </ArgonTypography> */}
        <CardHeader title="REGISTRAR NUEVA DENOMINACION EN TIPO DE ASEGURADO" />
      </ArgonBox>
      {/* <hr color='#11cdef' size='8px'/> */}
      <Divider sx={{ my: -1.5, backgroundColor: "#9ecc13", height: 2 }} />

      <ArgonBox pt={2} pb={3} px={5}>
        <ArgonBox component="form" role="form" onSubmit={handleSubmit_1}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={12}>
            <Grid item xs={4}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Código:
                </Typography>
                <ArgonInput
                  value={codTipAseg}
                  onChange={(event) => {
                    setCodTipSeg(event.target.value);
                    setErrorList({ ...errorList, codtipseg: "" });
                  }}
                />
              </Item>
              {errorList.codtipseg && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.codtipseg}
                </span>
              )}
            </Grid>

            <Grid item xs={8}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Denominación completa del Tipo de Asegurado:
                </Typography>

                <ArgonInput
                  value={destipseg}
                  onChange={(event) => {
                    setDesTipSeg(event.target.value);
                    setErrorList({ ...errorList, destipseg: "" });
                  }}
                />
              </Item>
              {errorList.destipseg && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.destipseg}
                </span>
              )}
            </Grid>
          </Grid>

          <ArgonBox mb={2}></ArgonBox>
          <ArgonBox display="flex" justifyContent="center" mt={4} mb={2}>
            <CustomButton
              px={1}
              type="submit"
              variant="contained"
              sx={{
                color: {
                  background: "#9ed800",
                  color: "white",
                  width: "25%",
                  display: "flex",
                  justifyContent: "center",
                },
                "&:hover": {
                  backgroundColor: "#9f9bbe", // Reemplaza 'new color' por el color deseado para el hover
                },
                marginRight: "10px",
              }}
              fullWidth
            >
              Guardar
            </CustomButton>
            <CustomButton
              px={1}
              // type="submit"
              variant="contained"
              sx={{
                color: {
                  background: "#bc9b75",
                  color: "white",
                  width: "25%",
                  display: "flex",
                  justifyContent: "center",
                },
                "&:hover": {
                  backgroundColor: "#d3c9b5", // Reemplaza 'new color' por el color deseado para el hover
                },
              }}
              fullWidth
            >
              <Link to={"/tipo_asegs"} style={{ color: "white" }}>
                Cancelar
              </Link>
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
  );
};

export default Form;
