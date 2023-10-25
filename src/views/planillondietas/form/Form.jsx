import React, { useState, useEffect } from "react";

import ArgonBox from "components/ArgonBox";
import Card from "@mui/material/Card";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";

import { styled } from "@mui/material/styles";

import { Button, Box } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";

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
import { Api_URL } from "config/Api_URL";
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
import Swal from "sweetalert2";

// const URI = "api/ordenes/"
// const URI1 = "api/actividades/";

const URI = Api_URL + "planillondietas/";
const URI1 = Api_URL + "alimentos/";
const URI2 = Api_URL + "productos/";
const URI3 = Api_URL + "programadietas/";
const URI4 = Api_URL + "preparaciones/";

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

/* fin del componente autocomplete*/

const Form = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [errorList, setErrorList] = useState({});

  const [fechaPrograma, setFechaPrograma] = useState("");

  const [fechaPlanillon, setFechaPlanillon] = useState("");
  const [regimenPlanillon, setRegimenPlanillon] = useState("");
  const [idProducto, setIdProducto] = useState([]);
  const [idPreparacion, setIdPreparacion] = useState([]);
  const [idAlimento, setIdAlimento] = useState("");
  const [idPrograma, setIdPrograma] = useState("");

  const [alimentos, setAlimentos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [preparaciones, setPreparaciones] = useState([]);
  useEffect(() => {
    getAlimentos();
    getProgramas();
    getProductos();
    getPreparaciones();
    if (id) {
      obtenerPlanillon();
    }
  }, []);

  const getProgramas = async () => {
    const response = await axios.get(URI3);
    setProgramas(response.data);
  };

  const getAlimentos = async () => {
    const response = await axios.get(URI1);
    setAlimentos(response.data);
  };

  const getProductos = async () => {
    const response = await axios.get(URI2);
    setProductos(response.data);
  };

  const getPreparaciones = async () => {
    const response = await axios.get(URI4);
    setPreparaciones(response.data);
  };
  //Obtiene los datos para editar
  const obtenerPlanillon = async () => {
    try {
      const response = await axios.get(`${URI}${id}`);
      setIdPrograma(response.data.programadieta_id);
      setFechaPlanillon(response.data.fecha_planillon);
      setRegimenPlanillon(response.data.regimen_planillon);
      // setIdProducto(response.data.producto_id);
      // setIdPreparacion(response.data.preparacion_id);
      setIdAlimento(response.data.alimento_id);

      // setIdProducto(response.data.productos.map((producto) => producto.id));
      setIdProducto(
        response.data.productos.map((producto) => ({
          id_2: producto?.id,
          nombre_producto: producto.catalogo?.nombre_producto,
          // cantidad_preparacion: producto.pivot.cantidad_preparacion,
        }))
      );

      setIdPreparacion(
        response.data.preparacions.map((preparacion) => ({
          id_2: preparacion?.id,
          nombre_preparacion: preparacion.nombre_preparacion,
          obs_preparacion: preparacion.pivot.obs_preparacion,
        }))
      );

      // setIdPreparacion(response.data.preparacions.map((preparacion) => preparacion.id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit_1 = async (event) => {
    try {
      event.preventDefault();
      if (id) {
        const response = await axios.put(`${URI}${id}`, {
          programadieta_id: idPrograma,
          fecha_planillon: fechaPlanillon,
          regimen_planillon: regimenPlanillon,
          // producto_id: idProducto,
          // preparacion_id: idPreparacion,
          alimento_id: idAlimento,

          producto_id: idProducto.map((item) => ({
            id: item.id || item.id_2,
          })),

          preparacion_id: idPreparacion.map((item) => ({
            id: item.id || item.id_2,
            obs_preparacion: item.obs_preparacion,
          })),
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Editado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/planillondietas");
        }
      } else {
        const response = await axios.post(URI, {
          programadieta_id: idPrograma,
          fecha_planillon: fechaPlanillon,
          regimen_planillon: regimenPlanillon,
          producto_id: idProducto,
          preparacion_id: idPreparacion,
          alimento_id: idAlimento,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Creado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/planillondietas");
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

  const handleProductoChange = (index, field, value) => {
    const updatedProducto = [...idProducto];
    updatedProducto[index][field] = value;
    setIdProducto(updatedProducto);
  };

  const handlePreparacionChange = (index, field, value) => {
    const updatedPreparacion = [...idPreparacion];
    updatedPreparacion[index][field] = value;
    setIdPreparacion(updatedPreparacion);
  };

  const handleEliminarFila = (index) => {
    setIdProducto(idProducto.filter((_, i) => i !== index));
  };
  const handleElimiFila = (index) => {
    setIdPreparacion(idPreparacion.filter((_, i) => i !== index)); //new
  };
  const handleAutocompleteChange = (event, value) => {
    if (value) {
      setIdProducto([...idProducto, value]);
    }
  };

  const handleAutocompleChange = (event, value) => {
    if (value) {
      setIdPreparacion([...idPreparacion, value]); //new
    }
  };

  return (
    <Card>
      <ArgonBox p={1} mb={1} textAlign="center">
        <CardHeader title="REGISTRAR PLANILLON - DIETA" />
      </ArgonBox>
      {/* <hr color='#344767' size='8px'/> */}
      <Divider sx={{ my: -1.5, backgroundColor: "lightdark", height: 4 }} />

      <ArgonBox pt={2} pb={3} px={5}>
        <ArgonBox component="form" role="form" onSubmit={handleSubmit_1}>
          {/* Inicio box */}
          <Box sx={{ width: "100%" }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={4}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Programa:
                  </Typography>

                  <Autocomplete
                    value={
                      idPrograma
                        ? programas.find((option) => {
                            return idPrograma === option.id;
                          }) ?? null
                        : null
                    }
                    onChange={(event, newValue) => {
                      setIdPrograma(newValue ? newValue.id : null);
                      if (newValue) {
                        setFechaPlanillon(newValue.fecha_programa);
                        setRegimenPlanillon(
                          newValue.desayuno +
                            ", " +
                            newValue.almuerzo +
                            ", " +
                            newValue.hipoglucido +
                            ", " +
                            newValue.hipopurinico +
                            ", " +
                            newValue.pure +
                            ", " +
                            newValue.vegetariano +
                            ", " +
                            newValue.comida +
                            ", " +
                            newValue.hipoglucido_2 +
                            ", " +
                            newValue.hipopurinico_2
                        );
                      } else {
                        setFechaPlanillon("");
                        setRegimenPlanillon("");
                      }
                      setErrorList({ ...errorList, programadieta_id: "" });
                    }}
                    disablePortal
                    sx={{ width: "100%", height: "100%" }}
                    disableListWrap
                    PopperComponent={StyledPopper}
                    ListboxComponent={ListboxComponent}
                    options={programas}
                    getOptionLabel={(option) => option.fecha_programa}
                    renderInput={(params) => <TextField {...params} />}
                    renderOption={(props, option, state) => [
                      props,
                      option.fecha_programa,
                      state.index,
                    ]}
                    renderGroup={(params) => params}
                  />
                </Item>
                {errorList.programadieta_id && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.programadieta_id}
                  </span>
                )}
              </Grid>
              <Grid item xs={4}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Fecha Planillon:
                  </Typography>
                  <ArgonInput
                    type="date"
                    value={fechaPlanillon}
                    onChange={(event) => {
                      setFechaPlanillon(event.target.value);
                      setErrorList({ ...errorList, fecha_planillon: "" });
                    }}
                  />
                </Item>
                {errorList.fecha_planillon && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.fecha_planillon}
                  </span>
                )}
              </Grid>

              <Grid item xs={4}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Seleccione Tipo Alimento:
                  </Typography>

                  <Autocomplete
                    value={
                      idAlimento
                        ? alimentos.find((option) => {
                            return idAlimento === option.id;
                          }) ?? null
                        : null
                    }
                    onChange={(event, newValue) => {
                      setIdAlimento(newValue ? newValue.id : null);
                      setErrorList({ ...errorList, alimento_id: "" });
                    }}
                    disablePortal
                    sx={{ width: "100%", height: "100%" }}
                    disableListWrap
                    PopperComponent={StyledPopper}
                    ListboxComponent={ListboxComponent}
                    options={alimentos}
                    getOptionLabel={(option) => option.nombre_alimento}
                    renderInput={(params) => <TextField {...params} />}
                    renderOption={(props, option, state) => [
                      props,
                      option.nombre_alimento,
                      state.index,
                    ]}
                    // renderOption={(props, option, state) => [props,  , option.id + " " + option.nombre_ambiente]}
                    renderGroup={(params) => params}
                  />
                </Item>
                {errorList.alimento_id && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.alimento_id}
                  </span>
                )}
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Detalle de Programa:
                  </Typography>
                  <TextField
                    fullWidth
                    id="standard-multiline-flexible fullWidth"
                    value={regimenPlanillon}
                    onChange={(event) => {
                      setRegimenPlanillon(event.target.value);
                      setErrorList({ ...errorList, regimen_planillon: "" });

                    }}
                    multiline
                    variant="standard"
                    inputProps={{ style: { whiteSpace: "pre-wrap" } }} // Asegura que el texto no se corte y ajuste automáticamente
                  />
                </Item>
                {errorList.regimen_planillon && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.regimen_planillon}
                  </span>
                )}
              </Grid>

              <Grid item xs={6}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Seleccione Productos:
                  </Typography>
                  <ThemeProvider theme={theme}>
                    <ArgonBox mb={3}>
                      <TableContainer component={Paper}>
                        {/*Buscador de insumos , Muestra en una tabla*/}
                        <Autocomplete
                          options={productos}
                          sx={{ width: "100%", height: "100%" }}
                          PopperComponent={StyledPopper}
                          ListboxComponent={ListboxComponent}
                          getOptionLabel={(option) => option.catalogo?.nombre_producto} // Ajusta según la propiedad de etiqueta real en tus datos de insumos
                          onChange={handleAutocompleteChange}
                          //renderInput={(params) => <input {...params} label="Insumo ID" />}
                          renderInput={(params) => <TextField {...params} />}
                          renderOption={(props, option, state) => [
                            props,
                            option.catalogo?.nombre_producto,
                            state.index,
                          ]}
                          // renderOption={(props, option, state) => [props,  , option.id + " " + option.nombre_ambiente]}
                          renderGroup={(params) => params}
                        />
                        {/* Muestra los resultados en la tabla */}
                        <Typography
                          p={1}
                          sx={{ mb: 1.5, textAlign: "center" }}
                          color="text.secondary"
                        >
                          Lista de Productos:
                        </Typography>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  backgroundColor: "#344767",
                                  fontWeight: "bold",
                                  border: "1px solid white",
                                  color: "white",
                                }}
                              >
                                Item
                              </TableCell>
                              <TableCell
                                sx={{
                                  backgroundColor: "#344767",
                                  fontWeight: "bold",
                                  border: "1px solid white",
                                  color: "white",
                                  textAlign: "center",
                                }}
                              >
                                Producto
                              </TableCell>

                              <TableCell
                                sx={{
                                  backgroundColor: "#344767",
                                  fontWeight: "bold",
                                  border: "1px solid white",
                                  color: "white",
                                  textAlign: "center",
                                }}
                              >
                                Opciones
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {idProducto.map((producto, index) => (
                              <TableRow key={index}>
                                <TableCell
                                  sx={{
                                    fontWeight: "bold",
                                    border: "1px solid white",
                                    //color: 'white',
                                    textAlign: "center",
                                  }}
                                >
                                  {index + 1}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: "bold",
                                    border: "1px solid white",
                                    //color: 'white',
                                    textAlign: "center",
                                  }}
                                >
                                  {producto.catalogo?.nombre_producto || producto.nombre_producto}
                                </TableCell>

                                <TableCell>
                                  <ArgonBox
                                    onClick={() => handleEliminarFila(index)}
                                    sx={{
                                      color: "red",
                                      textAlign: "center",
                                      fontSize: "23px",
                                      "&:hover": {
                                        cursor: "pointer",
                                        transform: "scale(1.2)",
                                      },
                                    }}
                                  >
                                    <Button
                                      variant="outlined"
                                      startIcon={<ClearIcon fontSize="" />}
                                      size="medium"
                                      style={{ fontSize: "14px" }}
                                      color="error"
                                    >
                                      QUITAR
                                    </Button>
                                  </ArgonBox>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </ArgonBox>
                  </ThemeProvider>
                </Item>
              </Grid>

              <Grid item xs={12}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Seleccione Preparaciones:
                  </Typography>
                  <ThemeProvider theme={theme}>
                    <ArgonBox mb={3}>
                      <TableContainer component={Paper}>
                        {/*Buscador de insumos , Muestra en una tabla*/}
                        <Autocomplete
                          options={preparaciones}
                          sx={{ width: "100%", height: "100%" }}
                          PopperComponent={StyledPopper}
                          ListboxComponent={ListboxComponent}
                          getOptionLabel={(option) => option.nombre_preparacion} // Ajusta según la propiedad de etiqueta real en tus datos de insumos
                          onChange={handleAutocompleChange}
                          //renderInput={(params) => <input {...params} label="Insumo ID" />}
                          renderInput={(params) => <TextField {...params} />}
                          renderOption={(props, option, state) => [
                            props,
                            option.nombre_preparacion,
                            state.index,
                          ]}
                          // renderOption={(props, option, state) => [props,  , option.id + " " + option.nombre_ambiente]}
                          renderGroup={(params) => params}
                        />
                        {/* Muestra los resultados en la tabla */}
                        <Typography
                          p={1}
                          sx={{ mb: 1.5, textAlign: "center" }}
                          color="text.secondary"
                        >
                          Lista de Preparaciones:
                        </Typography>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  backgroundColor: "#344767",
                                  fontWeight: "bold",
                                  border: "1px solid white",
                                  color: "white",
                                }}
                              >
                                Item
                              </TableCell>
                              <TableCell
                                sx={{
                                  backgroundColor: "#344767",
                                  fontWeight: "bold",
                                  border: "1px solid white",
                                  color: "white",
                                  textAlign: "center",
                                }}
                              >
                                Preparacion
                              </TableCell>
                              <TableCell
                                sx={{
                                  backgroundColor: "#344767",
                                  fontWeight: "bold",
                                  border: "1px solid white",
                                  color: "white",
                                  textAlign: "center",
                                }}
                              >
                                Observacion
                              </TableCell>

                              <TableCell
                                sx={{
                                  backgroundColor: "#344767",
                                  fontWeight: "bold",
                                  border: "1px solid white",
                                  color: "white",
                                  textAlign: "center",
                                }}
                              >
                                Opciones
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {idPreparacion.map((preparacion, index) => (
                              <TableRow key={index}>
                                <TableCell
                                  sx={{
                                    fontWeight: "bold",
                                    border: "1px solid white",
                                    //color: 'white',
                                    textAlign: "center",
                                  }}
                                >
                                  {index + 1}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: "bold",
                                    border: "1px solid white",
                                    //color: 'white',
                                    textAlign: "center",
                                  }}
                                >
                                  {preparacion.nombre_preparacion}
                                </TableCell>
                                {/* <TableCell
                                                                    sx={{
                                                                        fontWeight: "bold",
                                                                        border: "1px solid white",
                                                                        //color: 'white',
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    <TextField
                                                                        sx={{ width: "155px" }}
                                                                        //type="number"
                                                                        color="primary"
                                                                        value={preparacion.obs_preparacion}
                                                                        //onChange={(event) => setIdInsumo(event.target.value)}
                                                                        onChange={(e) =>
                                                                            handlePreparacionChange(index, "obs_preparacion", e.target.value)
                                                                        }
                                                                    />
                                                                </TableCell> */}
                                <TableCell
                                  sx={{
                                    fontWeight: "bold",
                                    border: "1px solid white",
                                    //color: 'white',
                                    textAlign: "center",
                                  }}
                                >
                                  <select
                                  
                                    value={preparacion.obs_preparacion}
                                    onChange={(e) =>
                                      handlePreparacionChange(
                                        index,
                                        "obs_preparacion",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Seleccionar</option>
                                    <option value="s/sal">s/sal</option>
                                    <option value="s/azuc">s/azuc</option>
                                  </select>
                                </TableCell>
                                <TableCell>
                                  <ArgonBox
                                    onClick={() => handleElimiFila(index)}
                                    sx={{
                                      color: "red",
                                      textAlign: "center",
                                      fontSize: "23px",
                                      "&:hover": {
                                        cursor: "pointer",
                                        transform: "scale(1.2)",
                                      },
                                    }}
                                  >
                                    <Button
                                      variant="outlined"
                                      startIcon={<ClearIcon fontSize="" />}
                                      size="medium"
                                      style={{ fontSize: "14px" }}
                                      color="error"
                                    >
                                      QUITAR
                                    </Button>
                                  </ArgonBox>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </ArgonBox>
                  </ThemeProvider>
                </Item>
              </Grid>
            </Grid>
          </Box>

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
              <Link to={"/planillondietas"} style={{ color: "white" }}>
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