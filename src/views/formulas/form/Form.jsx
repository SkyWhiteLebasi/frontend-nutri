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
import { Api_URL } from "config/Api_URL";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";

const URI = Api_URL +  "formulas/";

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
  const [codFormula, setCodFormula] = useState("");
  const [nombreFormula, setNombreFormula] = useState("");
  const [tipoFormula, setTipoFormula] = useState("");
  const [stockInicialFormula, setStockInicialFormula] = useState("");
  const [stockFormula, setStockFormula] = useState("");
  const [fvFormula, setFvFormula] = useState("");
  const [medidaFormula, setMedidaFormula] = useState("");

  useEffect(() => {
    if (id) {
      //   obtenerAmbiente();
      getCatalogo();
    }
  }, []);

  const getCatalogo = async () => {
    try {
      const response = await axios.get(`${URI}${id}`);
      //   setNombreAmbientes(response.data.nombre_ambiente);
      setCodFormula(response.data.cod_formula);
      setNombreFormula(response.data.nombre_formula);
      setTipoFormula(response.data.tipo_formula);
      setStockInicialFormula(response.data.stock_inicial_formula);
      setStockFormula(response.data.stock_formula);
      setFvFormula(response.data.fv_formula);
      setMedidaFormula(response.data.medida_formula);
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
          cod_formula: codFormula,
          nombre_formula: nombreFormula,
          tipo_formula: tipoFormula,
          stock_inicial_formula: stockInicialFormula,
          stock_formula: stockFormula,
          fv_formula: fvFormula,
          medida_formula: medidaFormula,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Editado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/formulas");
        }
      } else {
        const response = await axios.post(URI, {
          //   nombre_ambiente: nombreAmbientes,
          cod_formula: codFormula,
          nombre_formula: nombreFormula,
          tipo_formula: tipoFormula,
          stock_inicial_formula: stockInicialFormula,
          stock_formula: stockFormula,
          fv_formula: fvFormula,
          medida_formula: medidaFormula,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Creado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/formulas");
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
        <CardHeader title="REGISTRAR NUEVA FORMULA" />
      </ArgonBox>
      {/* <hr color='#11cdef' size='8px'/> */}
      <Divider sx={{ my: -1.5, backgroundColor: "lightdark", height: 4 }} />

      <ArgonBox pt={2} pb={3} px={5}>
        <ArgonBox component="form" role="form" onSubmit={handleSubmit_1}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={12}>
            <Grid item xs={3}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Código:
                </Typography>
                <ArgonInput
                  value={codFormula}
                  onChange={(event) => {
                    setCodFormula(event.target.value);
                    setErrorList({ ...errorList, cod_formula: "" });
                  }}
                />
              </Item>
              {errorList.cod_formula && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.cod_formula}
                </span>
              )}
            </Grid>

            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Denominación completa de la Formula:
                </Typography>

                <ArgonInput
                  value={nombreFormula}
                  onChange={(event) => {
                    setNombreFormula(event.target.value);
                    setErrorList({ ...errorList, nombre_formula: "" });
                  }}
                />
              </Item>
              {errorList.nombre_formula && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.nombre_formula}
                </span>
              )}
            </Grid>

            <Grid item xs={3}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Unidad de Medida:
                </Typography>

                <ArgonInput
                  value={medidaFormula}
                  onChange={(event) => {
                    setMedidaFormula(event.target.value);
                    setErrorList({ ...errorList, medida_formula: "" });
                  }}
                />
              </Item>
              {errorList.medida_formula && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.medida_formula}
                </span>
              )}
            </Grid>
            <Grid item xs={4}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Tipo:
                </Typography>

                <ArgonInput
                  value={tipoFormula}
                  onChange={(event) => {
                    setTipoFormula(event.target.value);
                    setErrorList({ ...errorList, tipo_formula: "" });
                  }}
                />
              </Item>
              {errorList.tipo_formula && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.tipo_formula}
                </span>
              )}
            </Grid>
            {id ? (
              <Grid item xs={id ? 2 : " "}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Stock Inicial:
                  </Typography>

                  <ArgonInput
                    value={stockInicialFormula}
                    onChange={(event) => {
                      setStockInicialFormula(event.target.value);
                      setErrorList({ ...errorList, stock_inicial_formula: "" });
                    }}
                  />
                </Item>
                {errorList.stock_inicial_formula && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.stock_inicial_formula}
                  </span>
                )}
              </Grid>
            ) : (
              ""
            )}

            <Grid item xs={id ? 2 : 4}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Stock:
                </Typography>

                <ArgonInput
                  value={stockFormula}
                  onChange={(event) => {
                    setStockFormula(event.target.value);
                    setErrorList({ ...errorList, stock_formula: "" });
                  }}
                />
              </Item>
              {errorList.stock_formula && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.stock_formula}
                </span>
              )}
            </Grid>
            <Grid item xs={4}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Fecha vencimiento:
                </Typography>

                <ArgonInput
                  type="date"
                  value={fvFormula}
                  onChange={(event) => {
                    setFvFormula(event.target.value);
                    setErrorList({ ...errorList, fv_formula: "" });
                  }}
                />
              </Item>
              {errorList.fv_formula && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.fv_formula}
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
              <Link to={"/formulas"} style={{ color: "white" }}>
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
