import React, { useState, useEffect } from "react";

import ArgonBox from "components/ArgonBox";
import Card from "@mui/material/Card";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ListSubheader } from "@mui/material";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";

import { styled } from "@mui/material/styles";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import CardHeader from "@mui/material/CardHeader";
import { Divider } from "@mui/material";
import PropTypes from "prop-types";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import Popper from "@mui/material/Popper";
import { useTheme } from "@mui/material/styles";
import { VariableSizeList } from "react-window";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom"; // Importa useHistory desde React Router
import { Api_URL } from "config/Api_URL";
const URI = "programadietas/";
const URI1 = "preparaciones/";

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

const FormEdit = () => {
  const [errorList, setErrorList] = useState({});

  const [preparaciones, setPreparaciones] = useState([]);
  const [fecha_programa, setFechaPrograma] = useState("");
  const [desayuno, setDesayuno] = useState("");
  const [almuerzo, setAlmuerzo] = useState("");
  const [hipoglucido, setHipoglucido] = useState("");
  const [hipopurinico, setHipopurinico] = useState("");
  const [pure, setPure] = useState("");
  const [vegetariano, setVegetariano] = useState("");
  const [comida, setComida] = useState("");
  const [hipoglucido_2, setHipoglucido_2] = useState("");
  const [hipopurinico_2, setHipopurinico_2] = useState("");
  const [pure_2, setPure_2] = useState("");
  const [nro_semana, setNumeroSemana] = useState("");

  const { id } = useParams();

  const getPreparaciones = async () => {
    const response = await axios.get(URI1);
    setPreparaciones(response.data);
  };

  const getProgramacion = async () => {
    const response = await axios.get(`${URI}${id}`);

    setFechaPrograma(response.data.fecha_programa);
    setNumeroSemana(response.data.nro_semana);
    setDesayuno(response.data.desayuno);
    setAlmuerzo(response.data.almuerzo);
    setHipoglucido(response.data.hipoglucido);
    setHipopurinico(response.data.hipopurinico);
    setPure(response.data.pure);
    setVegetariano(response.data.vegetariano);
    setComida(response.data.comida);
    setHipoglucido_2(response.data.hipoglucido_2);
    setHipopurinico_2(response.data.hipopurinico_2);
    setPure_2(response.data.pure_2);
  };

  useEffect(() => {
    getPreparaciones();
    getProgramacion();
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (id) {
        const response = await axios.put(`${URI}${id}`, {
          desayuno: desayuno,
          almuerzo: almuerzo,
          hipoglucido: hipoglucido,
          hipopurinico: hipopurinico,
          pure: pure,
          vegetariano: vegetariano,
          comida: comida,
          hipoglucido_2: hipoglucido_2,
          hipopurinico_2: hipopurinico_2,
          pure_2: pure_2,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Editado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/programadietas");
        }
      } else {
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
        <CardHeader title={fecha_programa + " Semana " + nro_semana} />
      </ArgonBox>
      {/* <hr color='#11cdef' size='8px'/> */}
      <Divider sx={{ my: -1.5, backgroundColor: "#9ecc13", height: 2 }} />

      <ArgonBox pt={2} pb={3} px={5}>
        <ArgonBox component="form" role="form" onSubmit={handleSubmit}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={12}>
            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Desayuno:
                </Typography>
                <Autocomplete
                  multiple
                  value={
                    desayuno
                      ? desayuno.split(",").map((value) => {
                          const matchingOption = preparaciones.find(
                            (option) => option.nombre_preparacion === value.trim()
                          );
                          return matchingOption || value.trim();
                        })
                      : []
                  }
                  onChange={(event, newValues) => {
                    const newSelectedIds = newValues
                      .map((newValue) =>
                        typeof newValue === "string" ? newValue.trim() : newValue.nombre_preparacion
                      )
                      .join(", "); // Unir los valores separados por comas
                    setDesayuno(newSelectedIds);
                    setErrorList({ ...errorList, desayuno: "" });

                  }}
                  disablePortal
                  sx={{ width: "100%", height: "100%" }}
                  disableListWrap
                  PopperComponent={StyledPopper}
                  ListboxComponent={ListboxComponent}
                  options={preparaciones}
                  getOptionLabel={(option) => option.nombre_preparacion}
                  renderInput={(params) => <TextField {...params} />}
                  renderOption={(props, option, state) => [
                    props,
                    option.nombre_preparacion,
                    state.index,
                  ]}
                  renderGroup={(params) => (
                    <li {...params}>
                      <strong>{params.key}</strong>
                    </li>
                  )}
                />
              </Item>
              {errorList.desayuno && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.desayuno}
                </span>
              )}
            </Grid>

            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Almuerzo
                </Typography>
                <Autocomplete
                  multiple
                  value={
                    almuerzo
                      ? almuerzo.split(",").map((value) => {
                          const matchingOption = preparaciones.find(
                            (option) => option.nombre_preparacion === value.trim()
                          );
                          return matchingOption || value.trim();
                        })
                      : []
                  }
                  onChange={(event, newValues) => {
                    const newSelectedIds = newValues
                      .map((newValue) =>
                        typeof newValue === "string" ? newValue.trim() : newValue.nombre_preparacion
                      )
                      .join(", "); // Unir los valores separados por comas
                    setAlmuerzo(newSelectedIds);
                    setErrorList({ ...errorList, almuerzo: "" });

                  }}
                  disablePortal
                  sx={{ width: "100%", height: "100%" }}
                  disableListWrap
                  PopperComponent={StyledPopper}
                  ListboxComponent={ListboxComponent}
                  options={preparaciones}
                  getOptionLabel={(option) => option.nombre_preparacion}
                  renderInput={(params) => <TextField {...params} />}
                  renderOption={(props, option, state) => [
                    props,
                    option.nombre_preparacion,
                    state.index,
                  ]}
                  renderGroup={(params) => (
                    <li {...params}>
                      <strong>{params.key}</strong>
                    </li>
                  )}
                />
              </Item>
              {errorList.almuerzo && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.almuerzo}
                </span>
              )}
            </Grid>

            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Hipoglucido
                </Typography>
                <Autocomplete
                  multiple
                  value={
                    hipoglucido
                      ? hipoglucido.split(",").map((value) => {
                          const matchingOption = preparaciones.find(
                            (option) => option.nombre_preparacion === value.trim()
                          );
                          return matchingOption || value.trim();
                        })
                      : []
                  }
                  onChange={(event, newValues) => {
                    const newSelectedIds = newValues
                      .map((newValue) =>
                        typeof newValue === "string" ? newValue.trim() : newValue.nombre_preparacion
                      )
                      .join(", "); // Unir los valores separados por comas
                    setHipoglucido(newSelectedIds);
                    setErrorList({ ...errorList, hipoglucido: "" });

                  }}
                  disablePortal
                  sx={{ width: "100%", height: "100%" }}
                  disableListWrap
                  PopperComponent={StyledPopper}
                  ListboxComponent={ListboxComponent}
                  options={preparaciones}
                  getOptionLabel={(option) => option.nombre_preparacion}
                  renderInput={(params) => <TextField {...params} />}
                  renderOption={(props, option, state) => [
                    props,
                    option.nombre_preparacion,
                    state.index,
                  ]}
                  renderGroup={(params) => (
                    <li {...params}>
                      <strong>{params.key}</strong>
                    </li>
                  )}
                />
                {errorList.hipoglucido && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.hipoglucido}
                </span>
              )}</Item>

            </Grid>

            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Hipopurinico
                </Typography>
                <Autocomplete
                  multiple
                  value={
                    hipopurinico
                      ? hipopurinico.split(",").map((value) => {
                          const matchingOption = preparaciones.find(
                            (option) => option.nombre_preparacion === value.trim()
                          );
                          return matchingOption || value.trim();
                        })
                      : []
                  }
                  onChange={(event, newValues) => {
                    const newSelectedIds = newValues
                      .map((newValue) =>
                        typeof newValue === "string" ? newValue.trim() : newValue.nombre_preparacion
                      )
                      .join(", "); // Unir los valores separados por comas
                    setHipopurinico(newSelectedIds);
                    setErrorList({ ...errorList, hipopurinico: "" });

                  }}
                  disablePortal
                  sx={{ width: "100%", height: "100%" }}
                  disableListWrap
                  PopperComponent={StyledPopper}
                  ListboxComponent={ListboxComponent}
                  options={preparaciones}
                  getOptionLabel={(option) => option.nombre_preparacion}
                  renderInput={(params) => <TextField {...params} />}
                  renderOption={(props, option, state) => [
                    props,
                    option.nombre_preparacion,
                    state.index,
                  ]}
                  renderGroup={(params) => (
                    <li {...params}>
                      <strong>{params.key}</strong>
                    </li>
                  )}
                />
              </Item>
              {errorList.hipopurinico && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.hipopurinico}
                </span>
              )}
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Pure
                </Typography>
                <Autocomplete
                  multiple
                  value={
                    pure
                      ? pure.split(",").map((value) => {
                          const matchingOption = preparaciones.find(
                            (option) => option.nombre_preparacion === value.trim()
                          );
                          return matchingOption || value.trim();
                        })
                      : []
                  }
                  onChange={(event, newValues) => {
                    const newSelectedIds = newValues
                      .map((newValue) =>
                        typeof newValue === "string" ? newValue.trim() : newValue.nombre_preparacion
                      )
                      .join(", "); // Unir los valores separados por comas
                    setPure(newSelectedIds);
                    setErrorList({ ...errorList, pure: "" });

                  }}
                  disablePortal
                  sx={{ width: "100%", height: "100%" }}
                  disableListWrap
                  PopperComponent={StyledPopper}
                  ListboxComponent={ListboxComponent}
                  options={preparaciones}
                  getOptionLabel={(option) => option.nombre_preparacion}
                  renderInput={(params) => <TextField {...params} />}
                  renderOption={(props, option, state) => [
                    props,
                    option.nombre_preparacion,
                    state.index,
                  ]}
                  renderGroup={(params) => (
                    <li {...params}>
                      <strong>{params.key}</strong>
                    </li>
                  )}
                />
              </Item>
              {errorList.pure && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.pure}
                </span>
              )}
            </Grid>

            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Vegetariano
                </Typography>
                <Autocomplete
                  multiple
                  value={
                    vegetariano
                      ? vegetariano.split(",").map((value) => {
                          const matchingOption = preparaciones.find(
                            (option) => option.nombre_preparacion === value.trim()
                          );
                          return matchingOption || value.trim();
                        })
                      : []
                  }
                  onChange={(event, newValues) => {
                    const newSelectedIds = newValues
                      .map((newValue) =>
                        typeof newValue === "string" ? newValue.trim() : newValue.nombre_preparacion
                      )
                      .join(", "); // Unir los valores separados por comas
                    setVegetariano(newSelectedIds);
                    setErrorList({ ...errorList, vegetariano: "" });

                  }}
                  disablePortal
                  sx={{ width: "100%", height: "100%" }}
                  disableListWrap
                  PopperComponent={StyledPopper}
                  ListboxComponent={ListboxComponent}
                  options={preparaciones}
                  getOptionLabel={(option) => option.nombre_preparacion}
                  renderInput={(params) => <TextField {...params} />}
                  renderOption={(props, option, state) => [
                    props,
                    option.nombre_preparacion,
                    state.index,
                  ]}
                  renderGroup={(params) => (
                    <li {...params}>
                      <strong>{params.key}</strong>
                    </li>
                  )}
                />
              </Item>
              {errorList.vegetariano && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.vegetariano}
                </span>
              )}
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Comida
                </Typography>
                <Autocomplete
                  multiple
                  value={
                    comida
                      ? comida.split(",").map((value) => {
                          const matchingOption = preparaciones.find(
                            (option) => option.nombre_preparacion === value.trim()
                          );
                          return matchingOption || value.trim();
                        })
                      : []
                  }
                  onChange={(event, newValues) => {
                    const newSelectedIds = newValues
                      .map((newValue) =>
                        typeof newValue === "string" ? newValue.trim() : newValue.nombre_preparacion
                      )
                      .join(", "); // Unir los valores separados por comas
                    setComida(newSelectedIds);
                    setErrorList({ ...errorList, comida: "" });

                  }}
                  disablePortal
                  sx={{ width: "100%", height: "100%" }}
                  disableListWrap
                  PopperComponent={StyledPopper}
                  ListboxComponent={ListboxComponent}
                  options={preparaciones}
                  getOptionLabel={(option) => option.nombre_preparacion}
                  renderInput={(params) => <TextField {...params} />}
                  renderOption={(props, option, state) => [
                    props,
                    option.nombre_preparacion,
                    state.index,
                  ]}
                  renderGroup={(params) => (
                    <li {...params}>
                      <strong>{params.key}</strong>
                    </li>
                  )}
                />
              </Item>
              {errorList.comida && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.comida}
                </span>
              )}
            </Grid>

            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Hipoglucido 2
                </Typography>
                <Autocomplete
                  multiple
                  value={
                    hipoglucido_2
                      ? hipoglucido_2.split(",").map((value) => {
                          const matchingOption = preparaciones.find(
                            (option) => option.nombre_preparacion === value.trim()
                          );
                          return matchingOption || value.trim();
                        })
                      : []
                  }
                  onChange={(event, newValues) => {
                    const newSelectedIds = newValues
                      .map((newValue) =>
                        typeof newValue === "string" ? newValue.trim() : newValue.nombre_preparacion
                      )
                      .join(", "); // Unir los valores separados por comas
                    setHipoglucido_2(newSelectedIds);
                    setErrorList({ ...errorList, hipoglucido_2: "" });

                  }}
                  disablePortal
                  sx={{ width: "100%", height: "100%" }}
                  disableListWrap
                  PopperComponent={StyledPopper}
                  ListboxComponent={ListboxComponent}
                  options={preparaciones}
                  getOptionLabel={(option) => option.nombre_preparacion}
                  renderInput={(params) => <TextField {...params} />}
                  renderOption={(props, option, state) => [
                    props,
                    option.nombre_preparacion,
                    state.index,
                  ]}
                  renderGroup={(params) => (
                    <li {...params}>
                      <strong>{params.key}</strong>
                    </li>
                  )}
                />
              </Item>
              {errorList.hipoglucido_2 && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.hipoglucido_2}
                </span>
              )}
            </Grid>

            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Hipopurinico 2
                </Typography>
                <Autocomplete
                  multiple
                  value={
                    hipopurinico_2
                      ? hipopurinico_2.split(",").map((value) => {
                          const matchingOption = preparaciones.find(
                            (option) => option.nombre_preparacion === value.trim()
                          );
                          return matchingOption || value.trim();
                        })
                      : []
                  }
                  onChange={(event, newValues) => {
                    const newSelectedIds = newValues
                      .map((newValue) =>
                        typeof newValue === "string" ? newValue.trim() : newValue.nombre_preparacion
                      )
                      .join(", "); // Unir los valores separados por comas
                    setHipopurinico_2(newSelectedIds);
                    setErrorList({ ...errorList, hipopurinico_2: "" });

                  }}
                  disablePortal
                  sx={{ width: "100%", height: "100%" }}
                  disableListWrap
                  PopperComponent={StyledPopper}
                  ListboxComponent={ListboxComponent}
                  options={preparaciones}
                  getOptionLabel={(option) => option.nombre_preparacion}
                  renderInput={(params) => <TextField {...params} />}
                  renderOption={(props, option, state) => [
                    props,
                    option.nombre_preparacion,
                    state.index,
                  ]}
                  renderGroup={(params) => (
                    <li {...params}>
                      <strong>{params.key}</strong>
                    </li>
                  )}
                />
              </Item>
              {errorList.hipopurinico_2 && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.hipopurinico_2}
                </span>
              )}
            </Grid>

            <Grid item xs={6}>
              <Item>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Pure 2
                </Typography>
                <Autocomplete
                  multiple
                  value={
                    pure_2
                      ? pure_2.split(",").map((value) => {
                          const matchingOption = preparaciones.find(
                            (option) => option.nombre_preparacion === value.trim()
                          );
                          return matchingOption || value.trim();
                        })
                      : []
                  }
                  onChange={(event, newValues) => {
                    const newSelectedIds = newValues
                      .map((newValue) =>
                        typeof newValue === "string" ? newValue.trim() : newValue.nombre_preparacion
                      )
                      .join(", "); // Unir los valores separados por comas
                    setPure_2(newSelectedIds);
                    setErrorList({ ...errorList, pure_2: "" });

                  }}
                  disablePortal
                  sx={{ width: "100%", height: "100%" }}
                  disableListWrap
                  PopperComponent={StyledPopper}
                  ListboxComponent={ListboxComponent}
                  options={preparaciones}
                  getOptionLabel={(option) => option.nombre_preparacion}
                  renderInput={(params) => <TextField {...params} />}
                  renderOption={(props, option, state) => [
                    props,
                    option.nombre_preparacion,
                    state.index,
                  ]}
                  renderGroup={(params) => (
                    <li {...params}>
                      <strong>{params.key}</strong>
                    </li>
                  )}
                />
              </Item>
              {errorList.pure_2 && (
                <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  {errorList.pure_2}
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
              <Link to={"/programadietas"} style={{ color: "white" }}>
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

export default FormEdit;
