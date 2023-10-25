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

const URI = Api_URL + "catalogos/";

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
  const [codProducto, setCodProducto] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [materialProducto, setMaterialProducto] = useState("");
  const [grupoArtProducto, setGrupoArtProducto] = useState("");
  const [medidaProducto, setMedidaProducto] = useState("");
  const [categoriaProducto, setCategoriaProducto] = useState("");

  useEffect(() => {
    if (id) {
      getCatalogo();
    }
  }, []);

  const getCatalogo = async () => {
    try {
      const response = await axios.get(`${URI}${id}`);
      //   setNombreAmbientes(response.data.nombre_ambiente);
      setCodProducto(response.data.cod_producto);
      setNombreProducto(response.data.nombre_producto);
      setMaterialProducto(response.data.material_producto);
      setGrupoArtProducto(response.data.grupo_art_producto);
      // setDescProducto(response.data.desc_producto);
      setMedidaProducto(response.data.medida_producto);
      setCategoriaProducto(response.data.categoria_producto);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit_1 = async (event) => {
    try {
      event.preventDefault();
      if (id) {
        const response = await axios.put(`${URI}${id}`, {
          //   nombre_ambiente: nombreAmbientes,
          cod_producto: codProducto,
          nombre_producto: nombreProducto,
          material_producto: materialProducto,
          grupo_art_producto: grupoArtProducto,
          // desc_producto: descProducto,
          medida_producto: medidaProducto,
          categoria_producto: categoriaProducto,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Editado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/catalogos");
        }
      } else {
        const response = await axios.post(URI, {
          //   nombre_ambiente: nombreAmbientes,
          cod_producto: codProducto,
          nombre_producto: nombreProducto,
          material_producto: materialProducto,
          grupo_art_producto: grupoArtProducto,
          // desc_producto: descProducto,
          medida_producto: medidaProducto,
          categoria_producto: categoriaProducto,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Creado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/catalogos");
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
        <CardHeader title="REGISTRAR NUEVO PRODUCTO EN CATALOGO" />
      </ArgonBox>
      {/* <hr color='#11cdef' size='8px'/> */}
      <Divider sx={{ my: -1.5, backgroundColor: "#9ecc13", height: 2 }} />

      <ArgonBox pt={2} pb={3} px={5}>
        <ArgonBox component="form" role="form" onSubmit={handleSubmit_1}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={12}>
            <Grid item xs={3}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Código:
                </Typography>
                <ArgonInput
                  value={codProducto}
                  onChange={(event) => {
                    setCodProducto(event.target.value);
                    setErrorList({ ...errorList, cod_producto: "" });
                  }}
                />
              </Item>
              {errorList.cod_producto && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.cod_producto}
                </span>
              )}
            </Grid>

            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Denominación completa del Producto:
                </Typography>

                <ArgonInput
                  value={nombreProducto}
                  onChange={(event) => {
                    setNombreProducto(event.target.value);
                    setErrorList({ ...errorList, nombre_producto: "" });
                  }}
                />
              </Item>
              {errorList.nombre_producto && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.nombre_producto}
                </span>
              )}
            </Grid>

            <Grid item xs={3}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Tipo de Material:
                </Typography>

                <ArgonInput
                  value={materialProducto}
                  onChange={(event) => {
                    setMaterialProducto(event.target.value);
                    setErrorList({ ...errorList, material_producto: "" });
                  }}
                />
              </Item>
              {errorList.material_producto && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.material_producto}
                </span>
              )}
            </Grid>

            <Grid item xs={4}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Unidad de Medida:
                </Typography>

                <ArgonInput
                  value={medidaProducto}
                  onChange={(event) => {
                    setMedidaProducto(event.target.value);
                    setErrorList({ ...errorList, medida_producto: "" });
                  }}
                />
              </Item>
              {errorList.medida_producto && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.medida_producto}
                </span>
              )}
            </Grid>
            <Grid item xs={4}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Categoria:
                </Typography>

                <ArgonInput
                  value={categoriaProducto}
                  onChange={(event) => {
                    setCategoriaProducto(event.target.value);
                    setErrorList({ ...errorList, categoria_producto: "" });
                  }}
                />
              </Item>
              {errorList.categoria_producto && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.categoria_producto}
                </span>
              )}
            </Grid>
            <Grid item xs={4}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Grupo Art:
                </Typography>

                <ArgonInput
                  value={grupoArtProducto}
                  onChange={(event) => {
                    setGrupoArtProducto(event.target.value);
                    setErrorList({ ...errorList, grupo_art_producto: "" });
                  }}
                />
              </Item>
              {errorList.grupo_art_producto && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.grupo_art_producto}
                </span>
              )}
            </Grid>
            {/* <Grid item xs={8}>
                            <Item>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Descripcion:
                                </Typography>

                                <ArgonInput
                                    value={descProducto}
                                    onChange={(event) => setDescProducto(event.target.value)}
                                />
                            </Item>
                        </Grid> */}
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
              <Link to={"/catalogos"} style={{ color: "white" }}>
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
