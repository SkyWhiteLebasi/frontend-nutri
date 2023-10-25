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
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
// import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Swal from "sweetalert2";

import ClearIcon from "@mui/icons-material/Clear";
import { DisabledByDefault } from "@mui/icons-material";
import { Api_URL } from "config/Api_URL";
const URI = Api_URL + "pedidodpisos/";

const URI1 = Api_URL + "planillondietas/";

const URI2 = Api_URL + "pisos/";

const URI3 = Api_URL + "preparaciones/";

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

const Form = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [errorList, setErrorList] = useState({});

  const [obsPedido, setObsPedido] = useState("");
  // const [cantPersonal, setCantPersonal] = useState('');
  const [fechaPedido, setFechaPedido] = useState("");
  const [alimento, setAlimento] = useState("");
  const [planillonDietaId, setPlanillonDietaId] = useState("");

  const [idPedidoPreparacion, setIdPedidoPreparacion] = useState([]);
  const [pisoId, setPisoId] = useState("");

  const [planillones, setPlanillones] = useState([]);
  const [pisos, setPisos] = useState([]);
  const [detalles, setDetalle] = useState("");
  const [preparacionesPlanillon, setPreparacionesPlanillon] = useState([]);
  const [detallespiso, setDetallepiso] = useState("");
  const [preparaciones, setPreparaciones] = useState([]);

  useEffect(() => {
    getPlanillon();
    getPiso();
    getPreparaciones();
    if (id) {
      getPedido();
    }
  }, []);

  //Obtiene los datos para el autocomplete
  const getPlanillon = async () => {
    const response = await axios.get(URI1);
    setPlanillones(response.data);
  };

  const getPiso = async () => {
    const response = await axios.get(URI2);
    setPisos(response.data);
  };
  const getPreparaciones = async () => {
    const response = await axios.get(URI3);
    setPreparaciones(response.data);
  };

  //Obtiene los datos para editar
  const getPedido = async () => {
    try {
      const response = await axios.get(`${URI}${id}`);
      setObsPedido(response.data.obs_pedido);
      // setCantPersonal(response.data.cant_personal);
      setFechaPedido(response.data.fecha_pedido);
      setAlimento(response.data.alimento);
      setPlanillonDietaId(response.data.planillon_dieta_id);
      setPisoId(response.data.piso_id);

      const preparacionesEnRespuesta = response.data.preparaciones;

      setIdPedidoPreparacion(
        preparacionesEnRespuesta.map((preparacion) => ({
          id_2: preparacion?.id,
          nombre_preparacion: preparacion.nombre_preparacion,
          obs_pedido: preparacion.pivot.obs_pedido,
          cantidad_pedido_normal: preparacion.pivot.cantidad_pedido_normal,
          cantidad_pedido_modificado: preparacion.pivot.cantidad_pedido_modificado,
          //existencias: insumo.existencias
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  console.log(alimento);

  const handleSubmit_1 = async (event) => {
    try {
      event.preventDefault();
      if (id) {
        const response = await axios.put(`${URI}${id}`, {
          obs_pedido: obsPedido,
          alimento: alimento,
          fecha_pedido: fechaPedido,
          planillon_dieta_id: planillonDietaId,
          piso_id: pisoId,
          preparacion_id: idPedidoPreparacion.map((item) => ({
            id: item.id || item.id_2,
            obs_pedido: item.obs_pedido,
            cantidad_pedido_normal: item.cantidad_pedido_normal,
            cantidad_pedido_modificado: item.cantidad_pedido_modificado,
          })),
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Editado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/pedidodpisos");
        }
      } else {
        const response = await axios.post(URI, {
          obs_pedido: obsPedido,
          alimento: alimento,
          fecha_pedido: fechaPedido,
          planillon_dieta_id: planillonDietaId,
          piso_id: pisoId,
          preparacion_id: idPedidoPreparacion,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Creado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/pedidodpisos");
        }
      }

      //setNombreAmbientes('');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.validation_errors) {
        setErrorList(error.response.data.validation_errors);
      }
    }
  };

  
  const handlePreparacionChange = (index, field, value) => {
    const updatedPreparacion = [...idPedidoPreparacion];
    updatedPreparacion[index][field] = value;
    setIdPedidoPreparacion(updatedPreparacion);
    // Verificar si value es undefined o null y eliminar el valor
  };
  const handleAutocompleChange = (event, value) => {
    if (value) {
      setIdPedidoPreparacion([...idPedidoPreparacion, value]); //new
    }
  };
  const handleElimiFila = (index) => {
    setIdPedidoPreparacion(idPedidoPreparacion.filter((_, i) => i !== index)); //new
  };
  const CustomButton = styled(Button)(({ theme }) => ({
    "&:hover": {
      backgroundColor: "green", // Reemplaza 'new color' por el color deseado para el hover
    },
  }));

  return (
    <Card>
      <ArgonBox p={1} mb={1} textAlign="center">
        <CardHeader
          title={id ? "ACTUALIZAR PEDIDO DIETA POR PISOS" : "REGISTRAR PEDIDO DIETA POR PISOS"}
        />
      </ArgonBox>
      {/* <hr color='#11cdef' size='8px'/> */}
      <Divider sx={{ my: -1.5, backgroundColor: "lightdark", height: 4 }} />
      <ArgonBox pt={2} pb={3} px={6}>
        <ArgonBox component="form" role="form" onSubmit={handleSubmit_1}>
          <Box sx={{ width: "100%" }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Seleccione el Planillon:
                  </Typography>

                  <Autocomplete
                    value={
                      planillonDietaId
                        ? planillones.find((option) => {
                            return planillonDietaId === option.id;
                          }) ?? null
                        : null
                    }
                    onChange={(event, newValue) => {
                      setPlanillonDietaId(newValue ? newValue.id : null);
                   
                      if (newValue) {
                        setFechaPedido(newValue.fecha_planillon);
                        setAlimento(newValue.alimento?.nombre_alimento);
                        const preparacionNombres = newValue.preparacions
                          .map((preparacion) => preparacion.nombre_preparacion)
                          .join(", ");
                        const productoNombres = newValue.productos
                          .map((producto) => producto.catalogo?.nombre_producto)
                          .join(", ");

                        const detalleTexto = `PREPARACIONES: ${preparacionNombres}  PRODUCTOS: ${productoNombres}`;
                        const preparacionesPlanillon = newValue.preparacions;
                        // setPreparacionesPlanillon(preparacionesPlanillon);
                        setIdPedidoPreparacion(preparacionesPlanillon);
                        setDetalle(detalleTexto);
                        // setDetalle(newValue.preparacions?.nombre_preparacion + ' ' + newValue.productos?.catalogo?.nombre_producto);
                        // const [regimenPlanillon, setRegimenPlanillon] = useState('');
                        // setFechaFin(newValue.fecha_fin);
                      } else {
                        setFechaPedido("");
                        setDetalle("");
                        setPreparacionesPlanillon("");
                        setAlimento("");
                        // setFechaFin('');
                      }
                      setErrorList({ ...errorList, planillon_dieta_id: "" });
                    }}
                    disablePortal
                    sx={{ width: "100%", height: "100%" }}
                    disableListWrap
                    PopperComponent={StyledPopper}
                    ListboxComponent={ListboxComponent}
                    options={planillones}
                    getOptionLabel={(option) =>
                      option.fecha_planillon + " " + option.alimento?.nombre_alimento
                    }
                    renderInput={(params) => <TextField {...params} />}
                    renderOption={(props, option, state) => [
                      props,
                      option.fecha_planillon + " " + option.alimento?.nombre_alimento,
                      state.index,
                    ]}
                    // renderOption={(props, option, state) => [props,  , option.id + " " + option.nombre_ambiente]}
                    renderGroup={(params) => params}
                    disabled={id ? true : false}
                  />
                </Item>
                {errorList.planillon_dieta_id && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.planillon_dieta_id}
                  </span>
                )}
              </Grid>
              <Grid item xs={3}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Fecha Pedido
                  </Typography>

                  <ArgonInput
                    value={fechaPedido}
                    onChange={(event) => {
                      setFechaPedido(event.target.value);
                      setErrorList({ ...errorList, fecha_pedido: "" });
                    }}
                  />
                </Item>
                {errorList.fecha_pedido && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.fecha_pedido}
                  </span>
                )}
              </Grid>

              <Grid item xs={3}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Alimento
                  </Typography>

                  <ArgonInput
                    type="text"
                    value={alimento}
                    onChange={(event) => {
                      setAlimento(event.target.value);
                      setErrorList({ ...errorList, alimento: "" });
                    }}
                  />
                </Item>
                {errorList.alimento && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.alimento}
                  </span>
                )}
              </Grid>

              <Grid item xs={12}>
                <Item>
                  {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Seleccione Preparaciones:
                  </Typography> */}
                  <ThemeProvider theme={theme}>
                    <ArgonBox mb={3}>
                      <TableContainer component={Paper}>
                        {/*Buscador de insumos , Muestra en una tabla*/}
                        {/* <Autocomplete
                                                    options={preparaciones}
                                                    sx={{ width: '100%', height: '100%' }}
                                                    PopperComponent={StyledPopper}
                                                    ListboxComponent={ListboxComponent}
                                                    getOptionLabel={(option) => option.nombre_preparacion} // Ajusta según la propiedad de etiqueta real en tus datos de insumos
                                                    onChange={handleAutocompleChange}
                                                    //renderInput={(params) => <input {...params} label="Insumo ID" />}
                                                    renderInput={(params) => <TextField  {...params} />}
                                                    renderOption={(props, option, state) => [props, option.nombre_preparacion, state.index]}
                                                    // renderOption={(props, option, state) => [props,  , option.id + " " + option.nombre_ambiente]}
                                                    renderGroup={(params) => params}
                                                /> */}
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
                                Pedido Normal
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
                                Pedido Modificar{" "}
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
                            {idPedidoPreparacion.map((preparacion, index) => (
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
                                <TableCell
                                  sx={{
                                    fontWeight: "bold",
                                    border: "1px solid white",
                                    //color: 'white',
                                    textAlign: "center",
                                  }}
                                >
                                  <TextField
                                    sx={{ width: "155px" }}
                                    type="number"
                                    color="primary"
                                    value={preparacion.cantidad_pedido_normal}
                                    onChange={(e) =>
                                      handlePreparacionChange(
                                        index,
                                        "cantidad_pedido_normal",
                                        e.target.value
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: "bold",
                                    border: "1px solid white",
                                    //color: 'white',
                                    textAlign: "center",
                                  }}
                                >
                                  <TextField
                                    sx={{ width: "155px" }}
                                    type="number"
                                    color="primary"
                                    value={preparacion.cantidad_pedido_modificado}
                                    onChange={(e) =>
                                      handlePreparacionChange(
                                        index,
                                        "cantidad_pedido_modificado",
                                        e.target.value
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: "bold",
                                    border: "1px solid white",
                                    //color: 'white',
                                    textAlign: "center",
                                  }}
                                >
                                  <select
                                    value={preparacion.obs_pedido}
                                    onChange={(e) =>
                                      handlePreparacionChange(index, "obs_pedido", e.target.value)
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

              <Grid item xs={12}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Seleccione piso:
                  </Typography>

                  <Autocomplete
                    value={
                      pisoId
                        ? pisos.find((option) => {
                            return pisoId === option.id;
                          }) ?? null
                        : null
                    }
                    onChange={(event, newValue) => {
                      setPisoId(newValue ? newValue.id : null);
                      setErrorList({ ...errorList, piso_id: "" });
                    }}
                    disablePortal
                    sx={{ width: "100%", height: "100%" }}
                    disableListWrap
                    PopperComponent={StyledPopper}
                    ListboxComponent={ListboxComponent}
                    options={pisos}
                    getOptionLabel={(option) =>
                      "PISO/AREA:" +
                      " " +
                      option.nombre_piso +
                      "            -            " +
                      " HOSPITAL:" +
                      "  " +
                      option.hospital?.desc_red
                    }
                    renderInput={(params) => <TextField {...params} />}
                    renderOption={(props, option, state) => [
                      props,
                      "PISO/AREA:" +
                        " " +
                        option.nombre_piso +
                        "               -             " +
                        " HOSPITAL:" +
                        "  " +
                        option.hospital?.desc_red,
                      state.index,
                    ]}
                    // renderOption={(props, option, state) => [props,  , option.id + " " + option.nombre_ambiente]}
                    renderGroup={(params) => params}
                  />
                </Item>
                {errorList.piso_id && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.piso_id}
                  </span>
                )}
              </Grid>

              <Grid item xs={12}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Observacion (Opcional):
                  </Typography>

                  <ArgonInput
                    type="text"
                    value={obsPedido}
                    onChange={(event) => {
                      setObsPedido(event.target.value);
                      setErrorList({ ...errorList, obs_pedido: "" });
                    }}
                  />
                </Item>
                {errorList.obs_pedido && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.obs_pedido}
                  </span>
                )}
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
              <Link to={"/pedidodpisos"} style={{ color: "white" }}>
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
