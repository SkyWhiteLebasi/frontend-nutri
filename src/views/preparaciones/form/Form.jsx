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
import Swal from "sweetalert2";

import ClearIcon from "@mui/icons-material/Clear";
import CardContent from "@mui/material/CardContent";

const URI = Api_URL + "preparaciones/";
const URI1 = Api_URL + "productos/";

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

  const [nombrePreparacion, setNombrePreparacion] = useState("");
  const [descPreparacion, setDescPreparacion] = useState("");

  const [idProducto, setIdProducto] = useState([]);

  const [productos, setProductos] = useState([]);


  //Obtiene los datos para el autocomplete
  const getProductos = async () => {
    const response = await axios.get(URI1);
    //console.log(response.data)
    setProductos(response.data);
  };

  const getPreparacion = async () => {
    try {
      const response = await axios.get(`${URI}${id}`);

      setNombrePreparacion(response.data.nombre_preparacion);
      setDescPreparacion(response.data.cod_preparacion);

      // setIdOficio(response.data.oficio_id);
      // setIdPersonal(response.data.personals.map((personal) => personal.id));
      // setFechaActividad(response.data.fecha_actividad);
      // setDescActividad(response.data.desc_actividad);
      // setIdProducto(response.data.personals.map((producto) => producto.id));
      setIdProducto(
        response.data.productos.map((producto) => ({
          id_2: producto?.id,
          nombre_producto: producto.catalogo?.nombre_producto,
          cantidad_preparacion: producto.pivot.cantidad_preparacion,
          //   cantidad_salida: insumo.pivot.cantidad_salida,
          //   existencias: insumo.pivot.existencias,
          //   cantidad_salida_val: insumo.pivot.cantidad_salida_val,

          //existencias: insumo.existencias
        }))
      );

      // setIdInsumo(response.data.insumos.map((insumo) => ({
      //     id_2: insumo?.id,
      //     desc_catalogo: insumo.catalogo?.nombre_insumo,
      //     cantidad_salida: insumo.pivot.cantidad_salida,
      //     existencias: insumo.pivot.existencias,
      //     cantidad_salida_val: insumo.pivot.cantidad_salida_val,

      //     //existencias: insumo.existencias
      //   })));

      /*const extractedInsumos = response.data.insumos.map((insumo) => ({
              id: insumo.id,
              cantidad_salida: parseFloat(insumo.pivot.cantidad_salida)
            }));*/
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProductos();

    if (id) {
      getPreparacion();
    }
  }, []);


  const handleSubmit_1 = async (event) => {
    try {
      event.preventDefault();
      if (id) {
        const response = await axios.put(`${URI}${id}`, {
          nombre_preparacion: nombrePreparacion,
          cod_preparacion: descPreparacion,

          // id_insumos: idInsumo.map((item) => ({
          //   id: item.id || item.id_2,
          //   cantidad_salida: item.cantidad_salida,
          //   existencia: item.existencias,
          //   cantidad_salida_val: item.cantidad_salida_val,
          id_productos: idProducto.map((item) => ({
            id: item.id || item.id_2,
            cantidad_preparacion: item.cantidad_preparacion,
            //   existencias: item.existencias,
            //   cantidad_salida_val: item.cantidad_salida_val
          })),
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Editado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/preparaciones");
        }
      } else {
        const response = await axios.post(URI, {
          nombre_preparacion: nombrePreparacion,
          cod_preparacion: descPreparacion,
          id_productos: idProducto,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Creado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/preparaciones");
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

  const handleInsumoChange = (index, field, value) => {
    const updatedProducto = [...idProducto];
    updatedProducto[index][field] = value;
    setIdProducto(updatedProducto);
  };

  const handleEliminarFila = (index) => {
    setIdProducto(idProducto.filter((_, i) => i !== index));
  };
  const handleAutocompleteChange = (event, value) => {
    if (value) {
      // const exist = idProducto.some((producto) => producto.catalogo.nombre_producto === value.catalogo.nombre_producto);
      // console.log(setIdProducto([...idProducto, value]))

      setIdProducto([...idProducto, value]);
    }
  };

  return (
    <Card>
      <ArgonBox p={1} mb={1} textAlign="center">
        {/* <ArgonTypography variant="h5" fontWeight="medium">
            Registrar Actividad
          </ArgonTypography> */}
        <CardHeader title={id ? "Actualizar Preparacion" : "Registrar Preparacion"} />
      </ArgonBox>
      {/* <hr color='#11cdef' size='8px'/> */}
      <Divider sx={{ my: -1.5, backgroundColor: "lightdark", height: 4 }} />

      <ArgonBox pt={2} pb={3} px={5}>
        <ArgonBox component="form" role="form" onSubmit={handleSubmit_1}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Nombre de la Preparación:
                </Typography>
                <ArgonInput
                  value={nombrePreparacion}
                  onChange={(event) => {
                    setNombrePreparacion(event.target.value);
                    setErrorList({ ...errorList, nombre_preparacion: "" });
                  }}
                />
              </Item>
              {errorList.nombre_preparacion && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.nombre_preparacion}
                </span>
              )}
            </Grid>

            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Código de la Preparación:
                </Typography>

                <ArgonInput
                  value={descPreparacion}
                  onChange={(event) => {
                    setDescPreparacion(event.target.value);
                    setErrorList({ ...errorList, cod_preparacion: "" });
                  }}
                />
              </Item>
              {errorList.cod_preparacion && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.cod_preparacion}
                </span>
              )}
            </Grid>
          </Grid>

          <Grid item xs={10} md={10}>
            <CardContent>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Agregar Productos:
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
                    <Typography p={1} sx={{ mb: 1.5, textAlign: "center" }} color="text.secondary">
                      Lista de Productos:
                    </Typography>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              backgroundColor: "#0481bb",
                              fontWeight: "bold",
                              border: "1px solid white",
                              color: "white",
                            }}
                          >
                            ID Productos
                          </TableCell>
                          <TableCell
                            sx={{
                              backgroundColor: "#0481bb",
                              fontWeight: "bold",
                              border: "1px solid white",
                              color: "white",
                              textAlign: "center",
                            }}
                          >
                            Producto ID
                          </TableCell>
                          <TableCell
                            sx={{
                              backgroundColor: "#0481bb",
                              fontWeight: "bold",
                              border: "1px solid white",
                              color: "white",
                              textAlign: "center",
                            }}
                          >
                            Cantidad Preparacion
                          </TableCell>

                          <TableCell
                            sx={{
                              backgroundColor: "#0481bb",
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
                                value={producto.cantidad_preparacion}
                                //onChange={(event) => setIdInsumo(event.target.value)}
                                onChange={(e) =>
                                  handleInsumoChange(index, "cantidad_preparacion", e.target.value)
                                }
                              />
                              {/* /* /*new mery*/}
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
            </CardContent>
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
              <Link to={"/preparaciones"} style={{ color: "white" }}>
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
