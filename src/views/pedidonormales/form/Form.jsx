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
import Swal from "sweetalert2";
import { Api_URL } from "config/Api_URL";
const URI = Api_URL + "pedidosnormales/";

const URI1 = Api_URL + "planillones/";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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
  const [errorList, setErrorList] = useState({});

  const navigate = useNavigate();

  const [obsPedido, setObsPedido] = useState("");
  const [cantPersonal, setCantPersonal] = useState("");
  const [fechaPedido, setFechaPedido] = useState("");
  const [alimento, setAlimento] = useState("");
  const [planillonNormalId, setPlanillonNormalId] = useState("");

  const [planillones, setPlanillones] = useState([]);
  const [detalles, setDetalle] = useState("");

  useEffect(() => {
    getPlanillon();
    if (id) {
      getPedido();
    }
  }, []); 

  useEffect(() => {
    if (id) {
      const selectedPlanillon = planillones.find((option) => option.id === planillonNormalId);
      if (planillonNormalId) {
        setFechaPedido(selectedPlanillon.fecha_planillon);
        setAlimento(selectedPlanillon.alimento?.nombre_alimento);
        const preparacionNombres = selectedPlanillon.preparacions
          .map((preparacion) => preparacion.nombre_preparacion)
          .join(", ");
        const productoNombres = selectedPlanillon.productos
          .map((producto) => producto.catalogo?.nombre_producto)
          .join(", ");
        const detalleTexto = `PREPARACIONES: ${preparacionNombres}  PRODUCTOS: ${productoNombres}`;
        setDetalle(detalleTexto);

        setErrorList({ ...errorList, planillon_normal_id: "" });
      } else {
        setFechaPedido("");
        setAlimento("");
        setDetalle("");
      }
    }
  }, [planillonNormalId]);

  //Obtiene los datos para el autocomplete
  const getPlanillon = async () => {
    const response = await axios.get(URI1);
    setPlanillones(response.data);
  };

  //Obtiene los datos para editar
  const getPedido = async () => {
    try {
      const response = await axios.get(`${URI}${id}`);
      setObsPedido(response.data.obs_pedido);
      setCantPersonal(response.data.cant_personal);
      setFechaPedido(response.data.fecha_pedido);
      setAlimento(response.data.alimento);
      setPlanillonNormalId(response.data.planillon_normal_id);
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
          obs_pedido: obsPedido,
          alimento: alimento,
          fecha_pedido: fechaPedido,
          cant_personal: cantPersonal,
          planillon_normal_id: planillonNormalId,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Editado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/pedidonormales");
        }
      } else {
        const response = await axios.post(URI, {
          obs_pedido: obsPedido,
          alimento: alimento,
          fecha_pedido: fechaPedido,
          cant_personal: cantPersonal,
          planillon_normal_id: planillonNormalId,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Creado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/pedidonormales");
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
        <CardHeader title={id ? "ACTUALIZAR PEDIDO NORMAL" : "REGISTRAR PEDIDO NORMAL"} />
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
                      planillonNormalId
                        ? planillones.find((option) => {
                            return planillonNormalId === option.id;
                          }) ?? null
                        : null
                    }
                    onChange={(event, newValue) => {
                      setPlanillonNormalId(newValue ? newValue.id : null);
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
                        setDetalle(detalleTexto);
                        // setDetalle(newValue.preparacions?.nombre_preparacion + ' ' + newValue.productos?.catalogo?.nombre_producto);
                        // const [regimenPlanillon, setRegimenPlanillon] = useState('');
                        // setFechaFin(newValue.fecha_fin);
                      } else {
                        setFechaPedido("");
                        setDetalle("");
                        setAlimento("");
                        // setFechaFin('');
                      }
                      setErrorList({ ...errorList, planillon_normal_id: "" });
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
                  />
                </Item>
                {errorList.planillon_normal_id && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.planillon_normal_id}
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
              <Grid item xs={6}>
                <Item>
                  {/* <Typography sx={{ mb: 1, width:420}} color="text.secondary">
                                        Detalle:
                                    </Typography> */}
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 430 }}>
                    <TextField
                      id="outlined-multiline-static"
                      // label="Multiline"
                      multiline
                      rows={6}
                      value={detalles}
                      onChange={(event) => {
                        setDetalle(event.target.value);
                        setErrorList({ ...errorList, detalles: "" });
                      }}
                    />
                  </FormControl>
                </Item>
                {errorList.detalles && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.detalles}
                  </span>
                )}
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Cantidad de Personal:
                  </Typography>
                  <ArgonInput
                    type="number"
                    value={cantPersonal}
                    onChange={(event) => {
                      setCantPersonal(event.target.value);
                      setErrorList({ ...errorList, cant_personal: "" });
                    }}
                  />
                </Item>
                {errorList.cant_personal && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.cant_personal}
                  </span>
                )}
              </Grid>

              <Grid item xs={12}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Observacion:
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
              <Link to={"/pedidonormales"} style={{ color: "white" }}>
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
