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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
// import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from "@mui/material/Select";
// import Box from '@mui/material/Box';
import Swal from "sweetalert2";
import { Api_URL } from "config/Api_URL";
const URI = Api_URL + "pacientes/";

const URI2 = Api_URL + "hospitales/";
const URI3 = Api_URL + "servicios/";
const URI4 = Api_URL + "tipo_asegs/";
const URI5 = Api_URL + "estaciones/";

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

  const [dniPaciente, setDniPaciente] = useState("");
  const [paciente, setPaciente] = useState("");
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState("");
  const [habitacion, setHabitacion] = useState("");
  const [cama, setCama] = useState("");
  // const [destipseg, setDestipseg] = useState('');
  // const [desc_cie, setDesc_cie] = useState('');
  // const [servicama, setServicama] = useState('');
  // const [pisoPaciente, setPisoPaciente] = useState('');
  const [hospitalId, setHospitalId] = useState("");
  const [servicioId, setServicioId] = useState("");
  const [tipoasegId, setTipoasegId] = useState("");
  const [estacionId, setEstacionId] = useState("");

  const [hospitales, setHospitales] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [tipoasegs, setTipoasegs] = useState([]);
  const [estaciones, setEstaciones] = useState([]);

  useEffect(() => {
    getHospital();
    getServicio();
    getTipoaseg();
    getEstacion();
    if (id) {
      getPaciente();
    }
  }, []);

  //Obtiene los datos para el autocomplete
  const getHospital = async () => {
    const response = await axios.get(URI2);
    setHospitales(response.data);
  };

  //Obtiene los datos para el autocomplete
  const getServicio = async () => {
    const response = await axios.get(URI3);
    setServicios(response.data);
  };

  //Obtiene los datos para el autocomplete
  const getTipoaseg = async () => {
    const response = await axios.get(URI4);
    setTipoasegs(response.data);
  };

  //Obtiene los datos para el autocomplete
  const getEstacion = async () => {
    const response = await axios.get(URI5);
    setEstaciones(response.data);
  };

  //Obtiene los datos para editar
  const getPaciente = async () => {
    try {
      const response = await axios.get(`${URI}${id}`);
      setDniPaciente(response.data.dni_paciente);
      setPaciente(response.data.paciente);
      setEdad(response.data.edad);
      setGenero(response.data.genero);
      setHabitacion(response.data.habitacion);
      setCama(response.data.cama);
      // setServicama(response.data.servicama);
      // setPisoPaciente(response.data.piso_paciente);
      setHospitalId(response.data.hospital_id);
      setServicioId(response.data.servicio_id);
      setTipoasegId(response.data.tipoaseg_id);
      setEstacionId(response.data.estacion_id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit_1 = async (event) => {
    try {
      event.preventDefault();
      if (id) {
        const response = await axios.put(`${URI}${id}`, {
          dni_paciente: dniPaciente,
          paciente: paciente,
          edad: edad,
          genero: genero,
          habitacion: habitacion,
          cama: cama,

          hospital_id: hospitalId,
          servicio_id: servicioId,
          tipoaseg_id: tipoasegId,
          estacion_id: estacionId,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Editado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/pacientes");
        }
      } else {
        const response = await axios.post(URI, {
          dni_paciente: dniPaciente,
          paciente: paciente,
          edad: edad,
          genero: genero,
          habitacion: habitacion,
          cama: cama,

          hospital_id: hospitalId,
          servicio_id: servicioId,
          tipoaseg_id: tipoasegId,
          estacion_id: estacionId,
        });
        if (response.data.status === 201) {
          Swal.fire({
            title: "Creado con Exito..",
            // text: 'Presione Clik para cerrar!',
            icon: "success",
            timer: 5500,
          });
          navigate("/pacientes");
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
        <CardHeader title="REGISTRAR DATOS DE PACIENTES" />
      </ArgonBox>
      <Divider sx={{ my: -1.5, backgroundColor: "lightdark", height: 4 }} />
      <ArgonBox pt={2} pb={3} px={5}>
        <ArgonBox component="form" role="form" onSubmit={handleSubmit_1}>
          <Box sx={{ width: "100%" }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={3}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    DNI del Paciente:
                  </Typography>
                  <ArgonInput
                    type="number"
                    value={dniPaciente}
                    onChange={(event) => {
                      setDniPaciente(event.target.value);
                      setErrorList({ ...errorList, dni_paciente: "" });
                    }}
                  />
                </Item>
                {errorList.dni_paciente && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.dni_paciente}
                  </span>
                )}
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Paciente:
                  </Typography>

                  <ArgonInput
                    type="text"
                    value={paciente}
                    onChange={(event) => {
                      setPaciente(event.target.value);
                      setErrorList({ ...errorList, paciente: "" });
                    }}
                  />
                </Item>
                {errorList.paciente && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.paciente}
                  </span>
                )}
              </Grid>

              <Grid item xs={3}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Edad:
                  </Typography>

                  <ArgonInput
                    value={edad}
                    onChange={(event) => {
                      setEdad(event.target.value);
                      setErrorList({ ...errorList, edad: "" });
                    }}
                  />
                </Item>
                {errorList.edad && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.edad}
                  </span>
                )}
              </Grid>

              <Grid item xs={4}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Genero:
                  </Typography>

                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={genero}
                    onChange={(event) => {
                      setGenero(event.target.value);
                      setErrorList({ ...errorList, genero: "" });
                    }}
                  >
                    <FormControlLabel value="F" control={<Radio />} label="F" />
                    <FormControlLabel value="M" control={<Radio />} label="M" />
                  </RadioGroup>
                </Item>
                {errorList.genero && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.genero}
                  </span>
                )}
              </Grid>

              <Grid item xs={2}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Habitacion:
                  </Typography>

                  <ArgonInput
                    value={habitacion}
                    onChange={(event) => {
                      setHabitacion(event.target.value);
                      setErrorList({ ...errorList, habitacion: "" });
                    }}
                  />
                </Item>
                {errorList.habitacion && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.habitacion}
                  </span>
                )}
              </Grid>
              <Grid item xs={2}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Cama:
                  </Typography>
                  <ArgonInput
                    value={cama}
                    onChange={(event) => {
                      setCama(event.target.value);
                      setErrorList({ ...errorList, cama: "" });
                    }}
                  />
                </Item>
                {errorList.cama && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.cama}
                  </span>
                )}
              </Grid>

              <Grid item xs={4}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Seleccione Tipo de Asegurado:
                  </Typography>

                  <Autocomplete
                    value={
                      tipoasegId
                        ? tipoasegs.find((option) => {
                            return tipoasegId === option.id;
                          }) ?? null
                        : null
                    }
                    onChange={(event, newValue) => {
                      setTipoasegId(newValue ? newValue.id : null);
                      setErrorList({ ...errorList, tipoaseg_id: "" });

                    }}
                    disablePortal
                    sx={{ width: "100%", height: "100%" }}
                    disableListWrap
                    PopperComponent={StyledPopper}
                    ListboxComponent={ListboxComponent}
                    options={tipoasegs}
                    getOptionLabel={(option) => option.destipseg}
                    renderInput={(params) => <TextField {...params} />}
                    renderOption={(props, option, state) => [props, option.destipseg, state.index]}
                    // renderOption={(props, option, state) => [props,  , option.id + " " + option.nombre_ambiente]}
                    renderGroup={(params) => params}
                  />
                </Item>
                {errorList.tipoaseg_id && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.tipoaseg_id}
                  </span>
                )}
              </Grid>

              <Grid item xs={4}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Seleccione Estacion:
                  </Typography>

                  <Autocomplete
                    value={
                      estacionId
                        ? estaciones.find((option) => {
                            return estacionId === option.id;
                          }) ?? null
                        : null
                    }
                    onChange={(event, newValue) => {
                      setEstacionId(newValue ? newValue.id : null);
                      setErrorList({ ...errorList, estacion_id: "" });
                    }}
                    disablePortal
                    sx={{ width: "100%", height: "100%" }}
                    disableListWrap
                    PopperComponent={StyledPopper}
                    ListboxComponent={ListboxComponent}
                    options={estaciones}
                    getOptionLabel={(option) => option.desc_estacion}
                    renderInput={(params) => <TextField {...params} />}
                    renderOption={(props, option, state) => [
                      props,
                      option.desc_estacion,
                      state.index,
                    ]}
                    // renderOption={(props, option, state) => [props,  , option.id + " " + option.nombre_ambiente]}
                    renderGroup={(params) => params}
                  />
                </Item>
                {errorList.estacion_id && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.estacion_id}
                  </span>
                )}
              </Grid>

              <Grid item xs={4}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Seleccione Servicio:
                  </Typography>

                  <Autocomplete
                    value={
                      servicioId
                        ? servicios.find((option) => {
                            return servicioId === option.id;
                          }) ?? null
                        : null
                    }
                    onChange={(event, newValue) => {
                      setServicioId(newValue ? newValue.id : null);
                      setErrorList({ ...errorList, servicio_id: "" });
                    }}
                    disablePortal
                    sx={{ width: "100%", height: "100%" }}
                    disableListWrap
                    PopperComponent={StyledPopper}
                    ListboxComponent={ListboxComponent}
                    options={servicios}
                    getOptionLabel={(option) => option.servintern}
                    renderInput={(params) => <TextField {...params} />}
                    renderOption={(props, option, state) => [props, option.servintern, state.index]}
                    // renderOption={(props, option, state) => [props,  , option.id + " " + option.nombre_ambiente]}
                    renderGroup={(params) => params}
                  />
                </Item>
                {errorList.servicio_id && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.servicio_id}
                  </span>
                )}
              </Grid>

              <Grid item xs={4}>
                <Item>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Seleccione Hospital:
                  </Typography>

                  <Autocomplete
                    value={
                      hospitalId
                        ? hospitales.find((option) => {
                            return hospitalId === option.id;
                          }) ?? null
                        : null
                    }
                    onChange={(event, newValue) => {
                      setHospitalId(newValue ? newValue.id : null);
                      setErrorList({ ...errorList, hospital_id: "" });
                    }}
                    disablePortal
                    sx={{ width: "100%", height: "100%" }}
                    disableListWrap
                    PopperComponent={StyledPopper}
                    ListboxComponent={ListboxComponent}
                    options={hospitales}
                    getOptionLabel={(option) => option.desc_red}
                    renderInput={(params) => <TextField {...params} />}
                    renderOption={(props, option, state) => [props, option.desc_red, state.index]}
                    // renderOption={(props, option, state) => [props,  , option.id + " " + option.nombre_ambiente]}
                    renderGroup={(params) => params}
                  />
                </Item>
                {errorList.hospital_id && (
                  <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorList.hospital_id}
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
              <Link to={"/pacientes"} style={{ color: "white" }}>
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
