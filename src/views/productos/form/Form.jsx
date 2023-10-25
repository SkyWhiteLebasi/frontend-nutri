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
// import Box from '@mui/material/Box';
import Swal from "sweetalert2";
import { Api_URL } from "config/Api_URL";
const URI = Api_URL + "productos/";

const URI1 = Api_URL + "catalogos/";

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

  const navigate = useNavigate();

  const [errorList, setErrorList] = useState({});

  const [stockProducto, setStockProducto] = useState("");
  const [stockInicial, setStockInicial] = useState("");
  const [fechaVenProducto, setFechaVenProducto] = useState("");
  const [obsProducto, setObsProducto] = useState("");
  const [catalogoId, setCatalogoId] = useState("");
  const [catalogos, setCatalogos] = useState([]);

  useEffect(() => {
    getCatalogo();
    if (id) {
      getProducto();
    }
  }, []);

  //Obtiene los datos para el autocomplete
  const getCatalogo = async () => {
    const response = await axios.get(URI1);
    setCatalogos(response.data);
  };

  //Obtiene los datos para editar
  const getProducto = async () => {
    try {
      const response = await axios.get(`${URI}${id}`);
      setStockProducto(response.data.stock_producto);
      setStockInicial(response.data.stock_inicial);
      setFechaVenProducto(response.data.fecha_ven_producto);
      setObsProducto(response.data.obs_producto);
      setCatalogoId(response.data.catalogo_id);
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
          stock_producto: stockProducto,
          stock_inicial: stockInicial,
          fecha_ven_producto: fechaVenProducto,
          obs_producto: obsProducto,
          catalogo_id: catalogoId,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Editado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/productos");
        }
      } else {
        const response = await axios.post(URI, {
          stock_producto: stockProducto,
          // stock_inicial: stockInicial,
          fecha_ven_producto: fechaVenProducto,
          obs_producto: obsProducto,
          catalogo_id: catalogoId,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Creado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/productos");
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
        <CardHeader title={id ? "ACTUALIZAR DATOS DE PRODUCTOS" : "REGISTRAR DATOS DE PRODUCTOS"} />
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
                    Seleccione el Producto:
                  </Typography>

                  <Autocomplete
                    value={
                      catalogoId
                        ? catalogos.find((option) => {
                            return catalogoId === option.id;
                          }) ?? null
                        : null
                    }
                    onChange={(event, newValue) => {
                      setCatalogoId(newValue ? newValue.id : null);
                      setErrorList({ ...errorList, catalogo_id: "" });
                    }}
                    disablePortal
                    sx={{ width: "100%", height: "100%" }}
                    disableListWrap
                    PopperComponent={StyledPopper}
                    ListboxComponent={ListboxComponent}
                    options={catalogos}
                    getOptionLabel={(option) => option.nombre_producto}
                    renderInput={(params) => <TextField {...params} />}
                    renderOption={(props, option, state) => [
                      props,
                      option.nombre_producto,
                      state.index,
                    ]}
                    // renderOption={(props, option, state) => [props,  , option.id + " " + option.nombre_ambiente]}
                    renderGroup={(params) => params}
                  />
                </Item>
                {errorList.catalogo_id && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.catalogo_id}
                  </span>
                )}
              </Grid>
              <Grid item xs={id ? 3 : 6}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Stock de Producto:
                  </Typography>
                  <ArgonInput
                    type="number"
                    value={stockProducto}
                    onChange={(event) => {
                      setStockProducto(event.target.value);
                      setErrorList({ ...errorList, stock_producto: "" });
                    }}
                  />
                </Item>
                {errorList.stock_producto && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.stock_producto}
                  </span>
                )}
              </Grid>

              {id ? (
                <Grid item xs={id ? 3 : " "}>
                  <Item>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Stock inicial
                    </Typography>

                    <ArgonInput
                      value={stockInicial}
                      onChange={(event) => {
                        setStockInicial(event.target.value);
                        setErrorList({ ...errorList, stock_inicial: "" });
                      }}
                    />
                  </Item>
                  {errorList.stock_inicial && (
                    <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                      {errorList.stock_inicial}
                    </span>
                  )}
                </Grid>
              ) : (
                ""
              )}

              <Grid item xs={6}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Fecha de Venc.:
                  </Typography>

                  <ArgonInput
                    type="date"
                    value={fechaVenProducto}
                    onChange={(event) => {
                      setFechaVenProducto(event.target.value);
                      setErrorList({ ...errorList, fecha_ven_producto: "" });
                    }}
                  />
                </Item>
                {errorList.fecha_ven_producto && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.fecha_ven_producto}
                  </span>
                )}
              </Grid>

              <Grid item xs={6}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Observacion:
                  </Typography>

                  <ArgonInput
                    type="text"
                    value={obsProducto}
                    onChange={(event) => {
                      setObsProducto(event.target.value);
                      setErrorList({ ...errorList, obs_producto: "" });
                    }}
                  />
                </Item>
                {errorList.obs_producto && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.obs_producto}
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
              <Link to={"/productos"} style={{ color: "white" }}>
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
