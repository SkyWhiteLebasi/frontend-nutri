import React, { useState, useEffect } from "react";

import ArgonBox from "components/ArgonBox";
import Card from "@mui/material/Card";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import CardHeader from "@mui/material/CardHeader";
import { Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Button, Box } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import Popper from "@mui/material/Popper";
import { useTheme } from "@mui/material/styles";
import { VariableSizeList } from "react-window";
import Typography from "@mui/material/Typography";
import { ListSubheader } from "@mui/material";

import Grid from "@mui/material/Grid";
import Popover from "@mui/material/Popover";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import { Api_URL } from "config/Api_URL";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const URI = Api_URL + "programaciones/";
const URI1 = Api_URL + "preparaciones/";
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
  // Function to get the dates for each day of the week
  const getNextWeekDates = () => {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const nextWeekDates = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + ((i + (7 - currentDayOfWeek)) % 7));
      nextWeekDates.push(nextDate.toISOString().split("T")[0]);
    }
    return nextWeekDates;
  };

  const navigate = useNavigate();
  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const [programaciones, setProgramaciones] = useState(
    getNextWeekDates().map((date) => ({
      fecha_programa: date,
      desayuno: [],
      comedor: [],
      hp: [],
      refresco: [],
      almuerzo: [],
      comida: [],
    }))
  );

  const [idPreparacion, setIdPreparacion] = useState([]);
  const [preparaciones, setPreparaciones] = useState([]);

  useEffect(() => {
    getPreparaciones();
  }, []);

  const getPreparaciones = async () => {
    const response = await axios.get(URI1);
    setPreparaciones(response.data);
  };
  const handleInputChange = (index, fieldName, value) => {
    const updatedProgramaciones = [...programaciones];
    if (fieldName === "desayuno") {
      updatedProgramaciones[index].desayuno = value; // Actualiza el valor de desayuno directamente
      updatedProgramaciones[index].preparacionesSeleccionadas = idPreparacion; // Actualiza el array de preparaciones seleccionadas
    } else if (fieldName === "almuerzo") {
      updatedProgramaciones[index].almuerzo = value; // Actualiza el valor de desayuno directamente
      updatedProgramaciones[index].preparacionesSeleccionadas = idPreparacion; // Actualiza el array de preparaciones seleccionadas
    } else if (fieldName === "comedor") {
      updatedProgramaciones[index].comedor = value; // Actualiza el valor de desayuno directamente
      updatedProgramaciones[index].preparacionesSeleccionadas = idPreparacion; // Actualiza el array de preparaciones seleccionadas
    } else if (fieldName === "hp") {
      updatedProgramaciones[index].hp = value; // Actualiza el valor de desayuno directamente
      updatedProgramaciones[index].preparacionesSeleccionadas = idPreparacion; // Actualiza el array de preparaciones seleccionadas
    } else if (fieldName === "refresco") {
      updatedProgramaciones[index].refresco = value; // Actualiza el valor de desayuno directamente
      updatedProgramaciones[index].preparacionesSeleccionadas = idPreparacion; // Actualiza el array de preparaciones seleccionadas
    } else if (fieldName === "comida") {
      updatedProgramaciones[index].comida = value; // Actualiza el valor de desayuno directamente
      updatedProgramaciones[index].preparacionesSeleccionadas = idPreparacion; // Actualiza el array de preparaciones seleccionadas
    } else {
      updatedProgramaciones[index] = {
        ...updatedProgramaciones[index],
        [fieldName]: value,
      };
    }
    setProgramaciones(updatedProgramaciones);
  };

  const [errorList, setErrorList] = useState({});

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const errorListCopy = {}; // Create a copy of errorList

      let response;
      for (let i = 0; i < programaciones.length; i++) {
        const programacion = programaciones[i];
        try {
          // programacion.desayunoString = preparacionesSeleccionadas.join(', '); // Actualiza el campo desayuno
          response = await axios.post(URI, {
            // nro_semana: programacion[i].nro_semana,
            fecha_programa: programacion.fecha_programa,
            desayuno: programacion.desayuno.join(", "),
            comedor: programacion.comedor.join(", "),
            hp: programacion.hp.join(", "),
            refresco: programacion.refresco.join(", "),
            almuerzo: programacion.almuerzo.join(", "),
            comida: programacion.comida.join(", "),
          });
        } catch (error) {
          errorListCopy[i] = error.response.data.validation_errors;
        }
      }
      setErrorList(errorListCopy);

      if (response.data.status === 201) {
        Swal.fire({
          title: "Creado con Exito..",
          // text: 'Presione Clik para cerrar!',
          icon: "success",
          timer: 5500,
        });
        navigate("/programaciones");
      }
      // Update errorList with all errors
    } catch (error) {}
  };
  console.log("errorList:", errorList);

  // const handleInputChange = (index, fieldName, value) => {
  //     const updatedProgramaciones = [...programaciones];
  //     updatedProgramaciones[index] = {
  //         ...updatedProgramaciones[index],
  //         [fieldName]: value
  //     };
  //     setProgramaciones(updatedProgramaciones);
  // };

  // const handleAddCampo = () => {
  //     setProgramaciones([...programaciones, { fecha_programa: '', desayuno: '', comedor: '', hp: '', refresco: '', almuerzo: '', comida: '' }]);
  // };

  const CustomButton = styled(Button)(({ theme }) => ({
    "&:hover": {
      backgroundColor: "green",
    },
  }));

  const [selectedValuesDesa, setSelectedValuesDesa] = useState(
    Array(programaciones.length).fill(null)
  ); // Array de estados para valores seleccionados
  const [popoverAnchorElsDesa, setPopoverAnchorElsDesa] = useState(
    Array(programaciones.length).fill(null)
  );
  const handleOptionClickDesa = (event, index) => {
    const updatedAnchors = [...popoverAnchorElsDesa];
    updatedAnchors[index] = event.currentTarget;
    setPopoverAnchorElsDesa(updatedAnchors);
  };
  const handlePopoverCloseDesa = (index) => {
    const updatedAnchors = [...popoverAnchorElsDesa];
    updatedAnchors[index] = null;
    setPopoverAnchorElsDesa(updatedAnchors);
  };

  const [selectedValuesCome, setSelectedValuesCome] = useState(
    Array(programaciones.length).fill(null)
  ); // Array de estados para valores seleccionados
  const [popoverAnchorElsCome, setPopoverAnchorElsCome] = useState(
    Array(programaciones.length).fill(null)
  );
  const handleOptionClickCome = (event, index) => {
    const updatedAnchors = [...popoverAnchorElsCome];
    updatedAnchors[index] = event.currentTarget;
    setPopoverAnchorElsCome(updatedAnchors);
  };
  const handlePopoverCloseCome = (index) => {
    const updatedAnchors = [...popoverAnchorElsCome];
    updatedAnchors[index] = null;
    setPopoverAnchorElsCome(updatedAnchors);
  };

  const [selectedValuesHp, setSelectedValuesHp] = useState(Array(programaciones.length).fill(null)); // Array de estados para valores seleccionados
  const [popoverAnchorElsHp, setPopoverAnchorElsHp] = useState(
    Array(programaciones.length).fill(null)
  );
  const handleOptionClickHp = (event, index) => {
    const updatedAnchors = [...popoverAnchorElsHp];
    updatedAnchors[index] = event.currentTarget;
    setPopoverAnchorElsHp(updatedAnchors);
  };
  const handlePopoverCloseHp = (index) => {
    const updatedAnchors = [...popoverAnchorElsHp];
    updatedAnchors[index] = null;
    setPopoverAnchorElsHp(updatedAnchors);
  };

  const [selectedValuesRefre, setSelectedValuesRefre] = useState(
    Array(programaciones.length).fill(null)
  ); // Array de estados para valores seleccionados
  const [popoverAnchorElsRefre, setPopoverAnchorElsRefre] = useState(
    Array(programaciones.length).fill(null)
  );
  const handleOptionClickRefre = (event, index) => {
    const updatedAnchors = [...popoverAnchorElsRefre];
    updatedAnchors[index] = event.currentTarget;
    setPopoverAnchorElsRefre(updatedAnchors);
  };
  const handlePopoverCloseRefre = (index) => {
    const updatedAnchors = [...popoverAnchorElsRefre];
    updatedAnchors[index] = null;
    setPopoverAnchorElsRefre(updatedAnchors);
  };

  const [selectedValuesAlm, setSelectedValuesAlm] = useState(
    Array(programaciones.length).fill(null)
  ); // Array de estados para valores seleccionados
  const [popoverAnchorElsAlm, setPopoverAnchorElsAlm] = useState(
    Array(programaciones.length).fill(null)
  );
  const handleOptionClickAlm = (event, index) => {
    const updatedAnchors1 = [...popoverAnchorElsAlm];
    updatedAnchors1[index] = event.currentTarget;
    setPopoverAnchorElsAlm(updatedAnchors1);
  };
  const handlePopoverCloseAlm = (index) => {
    const updatedAnchors1 = [...popoverAnchorElsAlm];
    updatedAnchors1[index] = null;
    setPopoverAnchorElsAlm(updatedAnchors1);
  };

  const [selectedValuesComida, setSelectedValuesComida] = useState(
    Array(programaciones.length).fill(null)
  ); // Array de estados para valores seleccionados
  const [popoverAnchorElsComida, setPopoverAnchorElsComida] = useState(
    Array(programaciones.length).fill(null)
  );
  const handleOptionClickComida = (event, index) => {
    const updatedAnchors1 = [...popoverAnchorElsComida];
    updatedAnchors1[index] = event.currentTarget;
    setPopoverAnchorElsComida(updatedAnchors1);
  };
  const handlePopoverCloseComida = (index) => {
    const updatedAnchors1 = [...popoverAnchorElsComida];
    updatedAnchors1[index] = null;
    setPopoverAnchorElsComida(updatedAnchors1);
  };

  const centerPopoverStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  // ...

  useEffect(() => {
    // Simula la carga de datos (reemplaza con tu lógica real)
    // Aquí puedes realizar una petición a una API o cargar los datos de manera asíncrona
    setTimeout(() => {
      setIsLoading(false); // Marca que los datos se han cargado
    }, 2000); // Simula una carga de 2 segundos (ajusta esto según tus necesidades)
  }, []);

  return (
    <div style={{ justifyContent: "center" }}>
      <Card variant="h2" align="center">
        <CardHeader title="PROGRAMACIÓN DE MENUS - NORMAL" />
        <Divider sx={{ my: -1.5, backgroundColor: "lightdark", height: 8 }} />
        <br />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            {programaciones.map((programacion, index) => (
              <Grid item xs={12} md={6} lg={1.7} key={index}>
                <Item>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    {daysOfWeek[index]}
                  </Typography>
                  <ArgonInput
                    type="date"
                    value={programacion.fecha_programa}
                    onChange={(event) =>
                      handleInputChange(index, "fecha_programa", event.target.value)
                    }
                  />

                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Desayuno
                    {/* Desayuno {index + 1}: */}
                  </Typography>
                  <div style={{ maxHeight: "100px", maxWidth: "200px", overflow: "auto" }}>
                    <TextField
                      onClick={(event) => handleOptionClickDesa(event, index)}
                      value={selectedValuesDesa[index]} // Muestra el valor seleccionado en el TextField
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  {errorList[index] && errorList[index]["desayuno"] && (
                    <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                      {errorList[index]["desayuno"]}
                    </span>
                  )}

                  {/* <ArgonInput
                                        // required
                                        value={programacion.desayuno}
                                        onChange={(event) => handleInputChange(index, 'desayuno', event.target.value)}
                                    /> */}

                  <Popover
                    open={Boolean(popoverAnchorElsDesa[index])}
                    anchorEl={popoverAnchorElsDesa[index]}
                    onClose={() => handlePopoverCloseDesa(index)}
                    anchorReference="none"
                    PaperProps={{
                      style: centerPopoverStyle,
                    }}
                  >
                    <Card
                      sx={{
                        width: 465,
                        height: 400,
                        backgroundColor: "#FFFF",
                        border: "2px solid #000", // Borde de 2 píxeles de grosor de color personalizado
                        borderRadius: "5px",
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="text.primary"
                        gutterBottom
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "10vh",
                        }}
                      >
                        Agregar Desayuno
                      </Typography>
                      <div
                        style={{
                          alignItems: "center",
                          marginBottom: "3px",
                          marginLeft: "15px",
                          marginRight: "15px",
                        }}
                      >
                        <Autocomplete
                          multiple
                          value={
                            programacion.desayuno
                              ? preparaciones.filter((option) =>
                                  programacion.desayuno.includes(option.nombre_preparacion)
                                )
                              : []
                          }
                          onChange={(event, newValues) => {
                            const newSelectedIds = newValues.map(
                              (newValue) => newValue.nombre_preparacion
                            );
                            setSelectedValuesDesa((prevValues) => {
                              const updatedValues = [...prevValues];
                              updatedValues[index] = newSelectedIds.join(", "); // Actualiza el valor en el array
                              return updatedValues;
                            });
                            const updatedErrorList = { ...errorList };
                            if (updatedErrorList[index]) {
                              updatedErrorList[index].desayuno = "";
                            }
                            setErrorList(updatedErrorList);
                            setIdPreparacion(newSelectedIds);
                            handleInputChange(index, "desayuno", newSelectedIds); // Actualiza las preparaciones seleccionadas en el array
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

                        <Button
                          onClick={() => handlePopoverCloseDesa(index)}
                          variant="contained"
                          sx={{
                            color: "#ffff",
                            backgroundColor: "#B122AF",
                            "&:hover": { backgroundColor: "#800080" },
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }} // Define el color personalizado
                        >
                          Guardar
                        </Button>
                      </div>
                    </Card>
                  </Popover>

                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Comedor
                  </Typography>
                  <div style={{ maxHeight: "100px", maxWidth: "200px", overflow: "auto" }}>
                    <TextField
                      onClick={(event) => handleOptionClickCome(event, index)}
                      value={selectedValuesCome[index]} // Muestra el valor seleccionado en el TextField
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  {errorList[index] && errorList[index]["comedor"] && (
                    <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                      {errorList[index]["comedor"]}
                    </span>
                  )}
                  {/* <ArgonInput
                                        // required
                                        value={programacion.comedor}
                                        onChange={(event) => handleInputChange(index, 'comedor', event.target.value)}
                                    /> */}

                  <Popover
                    open={Boolean(popoverAnchorElsCome[index])}
                    anchorEl={popoverAnchorElsCome[index]}
                    onClose={() => handlePopoverCloseCome(index)}
                    anchorReference="none"
                    PaperProps={{
                      style: centerPopoverStyle,
                    }}
                  >
                    <Card
                      sx={{
                        width: 465,
                        height: 400,
                        backgroundColor: "#FFFF",
                        border: "2px solid #000", // Borde de 2 píxeles de grosor de color personalizado
                        borderRadius: "5px",
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="text.primary"
                        gutterBottom
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "10vh",
                        }}
                      >
                        Agregar Comedor
                      </Typography>
                      <div
                        style={{
                          alignItems: "center",
                          marginBottom: "3px",
                          marginLeft: "15px",
                          marginRight: "15px",
                        }}
                      >
                        <Autocomplete
                          multiple
                          value={
                            programacion.comedor
                              ? preparaciones.filter((option) =>
                                  programacion.comedor.includes(option.nombre_preparacion)
                                )
                              : []
                          }
                          onChange={(event, newValues) => {
                            const newSelectedIds = newValues.map(
                              (newValue) => newValue.nombre_preparacion
                            );
                            setSelectedValuesCome((prevValues) => {
                              const updatedValues = [...prevValues];
                              updatedValues[index] = newSelectedIds.join(", "); // Actualiza el valor en el array
                              return updatedValues;
                            });
                            const updatedErrorList = { ...errorList };
                            if (updatedErrorList[index]) {
                              updatedErrorList[index].comedor = "";
                            }
                            setErrorList(updatedErrorList);
                            setIdPreparacion(newSelectedIds);
                            handleInputChange(index, "comedor", newSelectedIds); // Actualiza las preparaciones seleccionadas en el array
                          }}
                          disablePortal
                          sx={{ width: "100%", height: "100%" }}
                          disableListWrap
                          PopperComponent={StyledPopper}
                          ListboxComponent={ListboxComponent}
                          options={preparaciones}
                          getOptionLabel={(option) => option.nombre_preparacion}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {isLoading ? ( // Comprueba si se están cargando los datos
                                      <CircularProgress color="inherit" size={20} /> // Muestra un indicador de carga
                                    ) : (
                                      params.InputProps.endAdornment // Muestra el icono de Autocomplete
                                    )}
                                  </>
                                ),
                              }}
                            />
                          )}
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
                        <Button
                          onClick={() => handlePopoverCloseCome(index)}
                          variant="contained"
                          sx={{
                            color: "#ffff",
                            backgroundColor: "#B122AF",
                            "&:hover": { backgroundColor: "#800080" },
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }} // Define el color personalizado
                        >
                          Guardar
                        </Button>
                      </div>
                    </Card>
                  </Popover>

                  <Typography variant="h6" color="text.primary" gutterBottom>
                    HP
                  </Typography>
                  <div style={{ maxHeight: "100px", maxWidth: "200px", overflow: "auto" }}>
                    <TextField
                      onClick={(event) => handleOptionClickHp(event, index)}
                      value={selectedValuesHp[index]} // Muestra el valor seleccionado en el TextField
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  {errorList[index] && errorList[index]["hp"] && (
                    <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                      {errorList[index]["hp"]}
                    </span>
                  )}
                  {/* <ArgonInput
                                        // required
                                        value={programacion.hp}
                                        onChange={(event) => handleInputChange(index, 'hp', event.target.value)}
                                    /> */}
                  <Popover
                    open={Boolean(popoverAnchorElsHp[index])}
                    anchorEl={popoverAnchorElsHp[index]}
                    onClose={() => handlePopoverCloseHp(index)}
                    anchorReference="none"
                    PaperProps={{
                      style: centerPopoverStyle,
                    }}
                  >
                    <Card
                      sx={{
                        width: 465,
                        height: 400,
                        backgroundColor: "#FFFF",
                        border: "2px solid #000", // Borde de 2 píxeles de grosor de color personalizado
                        borderRadius: "5px",
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="text.primary"
                        gutterBottom
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "10vh",
                        }}
                      >
                        Agregar Hp
                      </Typography>
                      <div
                        style={{
                          alignItems: "center",
                          marginBottom: "3px",
                          marginLeft: "15px",
                          marginRight: "15px",
                        }}
                      >
                        <Autocomplete
                          multiple
                          value={
                            programacion.hp
                              ? preparaciones.filter((option) =>
                                  programacion.hp.includes(option.nombre_preparacion)
                                )
                              : []
                          }
                          onChange={(event, newValues) => {
                            const newSelectedIds = newValues.map(
                              (newValue) => newValue.nombre_preparacion
                            );
                            setSelectedValuesHp((prevValues) => {
                              const updatedValues = [...prevValues];
                              updatedValues[index] = newSelectedIds.join(", "); // Actualiza el valor en el array
                              return updatedValues;
                            });
                            const updatedErrorList = { ...errorList };
                            if (updatedErrorList[index]) {
                              updatedErrorList[index].hp = "";
                            }
                            setErrorList(updatedErrorList);
                            setIdPreparacion(newSelectedIds);
                            handleInputChange(index, "hp", newSelectedIds); // Actualiza las preparaciones seleccionadas en el array
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
                        <Button
                          onClick={() => handlePopoverCloseHp(index)}
                          variant="contained"
                          sx={{
                            color: "#ffff",
                            backgroundColor: "#B122AF",
                            "&:hover": { backgroundColor: "#800080" },
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}  // Define el color personalizado
                        >
                          Guardar
                        </Button>
                      </div>
                    </Card>
                  </Popover>

                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Refresco
                  </Typography>
                  <div style={{ maxHeight: "100px", maxWidth: "200px", overflow: "auto" }}>
                    <TextField
                      onClick={(event) => handleOptionClickRefre(event, index)}
                      value={selectedValuesRefre[index]} // Muestra el valor seleccionado en el TextField
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  {errorList[index] && errorList[index]["refresco"] && (
                    <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                      {errorList[index]["refresco"]}
                    </span>
                  )}
                  {/* <ArgonInput
                                        type="text"
                                        value={programacion.refresco}
                                        onChange={(event) => handleInputChange(index, 'refresco', event.target.value)}
                                    /> */}
                  <Popover
                    open={Boolean(popoverAnchorElsRefre[index])}
                    anchorEl={popoverAnchorElsRefre[index]}
                    onClose={() => handlePopoverCloseRefre(index)}
                    anchorReference="none"
                    PaperProps={{
                      style: centerPopoverStyle,
                    }}
                  >
                    <Card
                      sx={{
                        width: 465,
                        height: 400,
                        backgroundColor: "#FFFF",
                        border: "2px solid #000", // Borde de 2 píxeles de grosor de color personalizado
                        borderRadius: "5px",
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="text.primary"
                        gutterBottom
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "10vh",
                        }}
                      >
                        Agregar Hp
                      </Typography>
                      <div
                        style={{
                          alignItems: "center",
                          marginBottom: "3px",
                          marginLeft: "15px",
                          marginRight: "15px",
                        }}
                      >
                        <Autocomplete
                          multiple
                          value={
                            programacion.refresco
                              ? preparaciones.filter((option) =>
                                  programacion.refresco.includes(option.nombre_preparacion)
                                )
                              : []
                          }
                          onChange={(event, newValues) => {
                            const newSelectedIds = newValues.map(
                              (newValue) => newValue.nombre_preparacion
                            );
                            setSelectedValuesRefre((prevValues) => {
                              const updatedValues = [...prevValues];
                              updatedValues[index] = newSelectedIds.join(", "); // Actualiza el valor en el array
                              return updatedValues;
                            });
                            const updatedErrorList = { ...errorList };
                            if (updatedErrorList[index]) {
                              updatedErrorList[index].refresco = "";
                            }
                            setErrorList(updatedErrorList);
                            setIdPreparacion(newSelectedIds);
                            handleInputChange(index, "refresco", newSelectedIds); // Actualiza las preparaciones seleccionadas en el array
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
                        <Button
                          onClick={() => handlePopoverCloseRefre(index)}
                          variant="contained"
                          sx={{
                            color: "#ffff",
                            backgroundColor: "#B122AF",
                            "&:hover": { backgroundColor: "#800080" },
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}  // Define el color personalizado
                        >
                          Guardar
                        </Button>
                      </div>
                    </Card>
                  </Popover>

                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Almuerzo
                  </Typography>
                  <div style={{ maxHeight: "100px", maxWidth: "200px", overflow: "auto" }}>
                    <TextField
                      onClick={(event) => handleOptionClickAlm(event, index)}
                      value={selectedValuesAlm[index]} // Muestra el valor seleccionado en el TextField
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  {errorList[index] && errorList[index]["almuerzo"] && (
                    <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                      {errorList[index]["almuerzo"]}
                    </span>
                  )}
                  
                  {/* <ArgonInput
                                        // required
                                        value={programacion.almuerzo}
                                        onChange={(event) => handleInputChange(index, 'almuerzo', event.target.value)}
                                    /> */}
                  <Popover
                    open={Boolean(popoverAnchorElsAlm[index])}
                    anchorEl={popoverAnchorElsAlm[index]}
                    onClose={() => handlePopoverCloseAlm(index)}
                    anchorReference="none"
                    PaperProps={{
                      style: centerPopoverStyle,
                    }}
                  >
                    <Card
                      sx={{
                        width: 465,
                        height: 400,
                        backgroundColor: "#FFFF",
                        border: "2px solid #000", // Borde de 2 píxeles de grosor de color personalizado
                        borderRadius: "5px",
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="text.primary"
                        gutterBottom
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "10vh",
                        }}
                      >
                        Agregar Almuerzo
                      </Typography>
                      <div
                        style={{
                          alignItems: "center",
                          marginBottom: "3px",
                          marginLeft: "15px",
                          marginRight: "15px",
                        }}
                      >
                        <Autocomplete
                          multiple
                          value={
                            programacion.almuerzo
                              ? preparaciones.filter((option) =>
                                  programacion.almuerzo.includes(option.nombre_preparacion)
                                )
                              : []
                          }
                          onChange={(event, newValues) => {
                            const newSelectedIds = newValues.map(
                              (newValue) => newValue.nombre_preparacion
                            );
                            setSelectedValuesAlm((prevValues) => {
                              const updatedValues = [...prevValues];
                              updatedValues[index] = newSelectedIds.join(", "); // Actualiza el valor en el array
                              return updatedValues;
                            });
                            const updatedErrorList = { ...errorList };
                            if (updatedErrorList[index]) {
                              updatedErrorList[index].almuerzo = "";
                            }
                            setErrorList(updatedErrorList);
                            setIdPreparacion(newSelectedIds);
                            handleInputChange(index, "almuerzo", newSelectedIds); // Actualiza las preparaciones seleccionadas en el array
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
                        <Button
                          onClick={() => handlePopoverCloseAlm(index)}
                          variant="contained"
                          sx={{
                            color: "#ffff",
                            backgroundColor: "#B122AF",
                            "&:hover": { backgroundColor: "#800080" },
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }} // Define el color personalizado
                        >
                          Guardar
                        </Button>
                      </div>
                    </Card>
                  </Popover>

                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Comida
                  </Typography>
                  <div style={{ maxHeight: "100px", maxWidth: "200px", overflow: "auto" }}>
                    <TextField
                      onClick={(event) => handleOptionClickComida(event, index)}
                      value={selectedValuesComida[index]} // Muestra el valor seleccionado en el TextField
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  {errorList[index] && errorList[index]["comida"] && (
                    <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                      {errorList[index]["comida"]}
                    </span>
                  )}
                  {/* <ArgonInput
                                        // required
                                        value={programacion.comida}
                                        onChange={(event) => handleInputChange(index, 'comida', event.target.value)}
                                    /> */}
                  <Popover
                    open={Boolean(popoverAnchorElsComida[index])}
                    anchorEl={popoverAnchorElsComida[index]}
                    onClose={() => handlePopoverCloseComida(index)}
                    anchorReference="none"
                    PaperProps={{
                      style: centerPopoverStyle,
                    }}
                  >
                    <Card
                      sx={{
                        width: 465,
                        height: 400,
                        backgroundColor: "#FFFF",
                        border: "2px solid #000", // Borde de 2 píxeles de grosor de color personalizado
                        borderRadius: "5px",
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="text.primary"
                        gutterBottom
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "10vh",
                        }}
                      >
                        Agregar Comida
                      </Typography>
                      <div
                        style={{
                          alignItems: "center",
                          marginBottom: "3px",
                          marginLeft: "15px",
                          marginRight: "15px",
                        }}
                      >
                        <Autocomplete
                          multiple
                          value={
                            programacion.comida
                              ? preparaciones.filter((option) =>
                                  programacion.comida.includes(option.nombre_preparacion)
                                )
                              : []
                          }
                          onChange={(event, newValues) => {
                            const newSelectedIds = newValues.map(
                              (newValue) => newValue.nombre_preparacion
                            );
                            setSelectedValuesComida((prevValues) => {
                              const updatedValues = [...prevValues];
                              updatedValues[index] = newSelectedIds.join(", "); // Actualiza el valor en el array
                              return updatedValues;
                            });
                            const updatedErrorList = { ...errorList };
                            if (updatedErrorList[index]) {
                              updatedErrorList[index].comida = "";
                            }
                            setErrorList(updatedErrorList);
                            setIdPreparacion(newSelectedIds);
                            handleInputChange(index, "comida", newSelectedIds); // Actualiza las preparaciones seleccionadas en el array
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
                        <Button
                          onClick={() => handlePopoverCloseComida(index)}
                          variant="contained"
                          sx={{
                            color: "#ffff",
                            backgroundColor: "#B122AF",
                            "&:hover": { backgroundColor: "#800080" },
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }} // Define el color personalizado
                        >
                          Guardar
                        </Button>
                      </div>
                    </Card>
                  </Popover>
                </Item>
              </Grid>
            ))}
          </Grid>
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 20, marginBottom: 10 }}
          >
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
                  backgroundColor: "#d25c26",
                },
                marginRight: "10px",
              }}
              fullWidth
            >
              Guardar
            </CustomButton>
            {/* <CustomButton
                            px={1}
                            type="button"
                            variant="contained"
                            sx={{
                                'color': {
                                    background: '#058bbe',
                                    color: 'white',
                                    width: '25%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                },
                                '&:hover': {
                                    backgroundColor: '#0a7eb4',
                                },
                            }}
                            onClick={handleAddCampo}
                            fullWidth
                        >
                            Agregar
                        </CustomButton> */}
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
                  backgroundColor: "#0a7eb4",
                },
              }}
              fullWidth
            >
              <Link to={"/programaciones"} style={{ color: "white" }}>
                Cancelar
              </Link>
            </CustomButton>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Form;
