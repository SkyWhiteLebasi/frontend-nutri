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

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Swal from "sweetalert2";
import { Api_URL } from "config/Api_URL";
// import Swal from 'sweetalert2';
const URI = Api_URL + "entrada_formulas/";
// const URI1 = "http://127.0.0.1:8000/api/user/";
const URI2 = Api_URL + "formulas/";
const URI1 = Api_URL + "perfilUsuario/";
/*incio del componente autocomplete*/
const LISTBOX_PADDING = 20; // px

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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
  const [nombreUser, setNombreUser] = useState("");

  const [fechaEntrada, setFechaEntrada] = useState("");
  const [observacionEntrada, setObservacionEntrada] = useState("");
  const [cantidadEntrada, setCantidadEntrada] = useState("");
  const [idUsuarios, setIdUsuarios] = useState({ nombreUser });
  const [idFormulas, setIdFormulas] = useState("");
  const [numEntrada, setNumEntrada] = useState("");

  const [formulas, setFormulas] = useState([]);

  useEffect(() => {
    getNombreUser();
    getFormulas();
    if (id) {
      //   obtenerAmbiente();
      getEntradas();
    }
    // Obtener la fecha actual en el formato "YYYY-MM-DD"
    const currentDate = new Date().toISOString().slice(0, 10);
    setFechaEntrada(currentDate);
  }, []);

  // Obtiene los datos para el autocomplete
  const getNombreUser = async () => {
    const response = await axios.get(URI1);
    const { nombre, apellido_paterno, apellido_materno } = response.data;
    const fullName = `${nombre} ${apellido_paterno} ${apellido_materno}`;
    setNombreUser(fullName);
    setIdUsuarios(fullName);
  }

  //Obtiene los datos para el autocomplete
  const getFormulas = async () => {
    const response = await axios.get(URI2);
    setFormulas(response.data);
  };

  const getEntradas = async () => {
    try {
      const response = await axios.get(`${URI}${id}`);
      setNumEntrada(response.data.num_entrada);
      // setNombreUser(response.data.usuario);
      setIdUsuarios(response.data.usuario);
      setIdFormulas(response.data.formulas_id);
      setFechaEntrada(response.data.fecha_entrada);
      setObservacionEntrada(response.data.observacion_entrada);
      setCantidadEntrada(response.data.cantidad_entrada);
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
          num_entrada: numEntrada,
          // usuario: nombreUser,
          usuario: idUsuarios,
          formulas_id: idFormulas,
          fecha_entrada: fechaEntrada,
          observacion_entrada: observacionEntrada,
          cantidad_entrada: cantidadEntrada,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Editado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/entradaformulas");
        }
      } else {
        const response = await axios.post(URI, {
          //   nombre_ambiente: nombreAmbientes,
          num_entrada: numEntrada,
          // usuario: nombreUser,
          usuario: idUsuarios,
          formulas_id: idFormulas,
          fecha_entrada: fechaEntrada,
          observacion_entrada: observacionEntrada,
          cantidad_entrada: cantidadEntrada,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Creado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/entradaformulas");
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
        <CardHeader title={id ? "ACTUALIZAR ENTRADA" : "REGISTRAR NUEVA ENTRADA"} />
      </ArgonBox>
      {/* <hr color='#11cdef' size='8px'/> */}
      <Divider sx={{ my: -1.5, backgroundColor: "lightdark", height: 4 }} />

      <ArgonBox pt={2} pb={3} px={5}>
        <ArgonBox component="form" role="form" onSubmit={handleSubmit_1}>
          <Box sx={{ width: "100%" }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={4}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Numero de Entrada:
                  </Typography>
                  <ArgonInput
                    type="text"
                    value={numEntrada}
                    onChange={(event) => {
                      setNumEntrada(event.target.value);
                      setErrorList({ ...errorList, num_entrada: "" });
                    }}
                  />
                </Item>
                {errorList.num_entrada && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.num_entrada}
                  </span>
                )}
              </Grid>
              {/* <Grid item xs={4}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Usuario Responsable:
                  </Typography>
                  <ArgonInput
                    // disabled
                    type="text"
                    value={nombreUser}
                    onChange={(event) => {
                      setNombreUser(event.target.value);
                      setErrorList({ ...errorList, usuario: "" });
                    }}
                  />
                </Item>
                {errorList.usuario && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.usuario}
                  </span>
                )}
              </Grid> */}
              <Grid item xs={4}>
                <Item>

                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Usuario Responsable:
                  </Typography>
                  <ArgonInput
                    disabled
                    type="text"
                    value={idUsuarios}
                    onChange={(event) => setIdUsuarios(event.target.value)}
                  />
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Fecha de la Entrada:
                  </Typography>
                  <ArgonInput
                    type="date"
                    value={fechaEntrada}
                    onChange={(event) => {
                      setFechaEntrada(event.target.value);
                      setErrorList({ ...errorList, fecha_entrada: "" });
                    }}
                  />
                </Item>
                {errorList.fecha_entrada && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.fecha_entrada}
                  </span>
                )}
              </Grid>
              <Grid item xs={4}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Seleccione la formula:
                  </Typography>

                  <Autocomplete
                    value={
                      idFormulas
                        ? formulas.find((option) => {
                          return idFormulas === option.id;
                        }) ?? null
                        : null
                    }
                    onChange={(event, newValue) => {
                      setIdFormulas(newValue ? newValue.id : null);
                      setErrorList({ ...errorList, formulas_id: "" });
                    }}
                    disablePortal
                    sx={{ width: "100%", height: "100%" }}
                    disableListWrap
                    PopperComponent={StyledPopper}
                    ListboxComponent={ListboxComponent}
                    options={formulas}
                    getOptionLabel={(option) => option.id + " " + option.nombre_formula} // + ' ' + option.catalogo?.nombre_producto
                    renderInput={(params) => <TextField {...params} />}
                    renderOption={(props, option, state) => [
                      props,
                      option.id + " " + option.nombre_formula,
                      state.index,
                    ]} // + ' ' + option.catalogo?.nombre_producto
                    // renderOption={(props, option, state) => [props,  , option.id + " " + option.nombre_ambiente]}
                    renderGroup={(params) => params}
                  />
                </Item>
                {errorList.formulas_id && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.formulas_id}
                  </span>
                )}
              </Grid>

              <Grid item xs={4}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Cantidad de Entrada:
                  </Typography>

                  <ArgonInput
                    value={cantidadEntrada}
                    onChange={(event) => {
                      setCantidadEntrada(event.target.value);
                      setErrorList({ ...errorList, cantidad_entrada: "" });
                    }}
                  />
                </Item>
                {errorList.cantidad_entrada && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.cantidad_entrada}
                  </span>
                )}
              </Grid>

              <Grid item xs={4}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Observación de la Entrada:
                  </Typography>
                  <ArgonInput
                    value={observacionEntrada}
                    onChange={(event) => {
                      setObservacionEntrada(event.target.value);
                      setErrorList({ ...errorList, observacion_entrada: "" });

                    }}
                  />
                </Item>
                {errorList.observacion_entrada && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.observacion_entrada}
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
              <Link to={"/entradaformulas"} style={{ color: "white" }}>
                Cancelar
              </Link>
            </CustomButton>
          </ArgonBox>
          <ArgonBox mt={2}>
            <ArgonTypography variant="button" color="text" fontWeight="regular">
              Revise los datos antes de guardar&nbsp;
            </ArgonTypography>
          </ArgonBox>
        </ArgonBox>
      </ArgonBox>
    </Card>
  );
};

export default Form;
