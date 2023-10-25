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
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import Modal from "@mui/material/Modal";
import Popover from "@mui/material/Popover";
import Swal from "sweetalert2";
import { Api_URL } from "config/Api_URL";
const URI = Api_URL + "programadietas/";
const URI1 = Api_URL + "preparaciones/";

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
  const [preparacionesSeleccionadas, setPreparacionesSeleccionadas] = useState([]);

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
      almuerzo: [],
      hipoglucido: [],
      hipopurinico: [],
      pure: [],
      vegetariano: [],
      comida: [],
      hipoglucido_2: [],
      hipopurinico_2: [],
      pure_2: [],
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
    } else if (fieldName === "hipoglucido") {
      updatedProgramaciones[index].hipoglucido = value; // Actualiza el valor de desayuno directamente
      updatedProgramaciones[index].preparacionesSeleccionadas = idPreparacion; // Actualiza el array de preparaciones seleccionadas
    } else if (fieldName === "hipopurinico") {
      updatedProgramaciones[index].hipopurinico = value; // Actualiza el valor de desayuno directamente
      updatedProgramaciones[index].preparacionesSeleccionadas = idPreparacion; // Actualiza el array de preparaciones seleccionadas
    } else if (fieldName === "pure") {
      updatedProgramaciones[index].pure = value; // Actualiza el valor de desayuno directamente
      updatedProgramaciones[index].preparacionesSeleccionadas = idPreparacion; // Actualiza el array de preparaciones seleccionadas
    } else if (fieldName === "vegetariano") {
      updatedProgramaciones[index].vegetariano = value; // Actualiza el valor de desayuno directamente
      updatedProgramaciones[index].preparacionesSeleccionadas = idPreparacion; // Actualiza el array de preparaciones seleccionadas
    } else if (fieldName === "comida") {
      updatedProgramaciones[index].comida = value; // Actualiza el valor de desayuno directamente
      updatedProgramaciones[index].preparacionesSeleccionadas = idPreparacion; // Actualiza el array de preparaciones seleccionadas
    } else if (fieldName === "hipoglucido_2") {
      updatedProgramaciones[index].hipoglucido_2 = value; // Actualiza el valor de desayuno directamente
      updatedProgramaciones[index].preparacionesSeleccionadas = idPreparacion; // Actualiza el array de preparaciones seleccionadas
    } else if (fieldName === "hipopurinico_2") {
      updatedProgramaciones[index].hipopurinico_2 = value; // Actualiza el valor de desayuno directamente
      updatedProgramaciones[index].preparacionesSeleccionadas = idPreparacion; // Actualiza el array de preparaciones seleccionadas
    } else if (fieldName === "pure_2") {
      updatedProgramaciones[index].pure_2 = value; // Actualiza el valor de desayuno directamente
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
      const errorListCopy = {};
      let response;
      for (let i = 0; i < programaciones.length; i++) {
        const programacion = programaciones[i];
        try {
          // programacion.desayunoString = preparacionesSeleccionadas.join(', '); // Actualiza el campo desayuno
          response = await axios.post(URI, {
            fecha_programa: programacion.fecha_programa,
            desayuno: programacion.desayuno.join(", "), // Use the desayuno array
            almuerzo: programacion.almuerzo.join(", "),
            hipoglucido: programacion.hipoglucido.join(", "),
            hipopurinico: programacion.hipopurinico.join(", "),
            pure: programacion.pure.join(", "),
            vegetariano: programacion.vegetariano.join(", "),
            comida: programacion.comida.join(", "),
            hipoglucido_2: programacion.hipoglucido_2.join(", "),
            hipopurinico_2: programacion.hipopurinico_2.join(", "),
            pure_2: programacion.pure_2.join(", "),
            // preparacionesSeleccionadas: programacion.preparacionesSeleccionadas,
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
        navigate("/programadietas");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const CustomButton = styled(Button)(({ theme }) => ({
    "&:hover": {
      backgroundColor: "green",
    },
  }));

  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState([]);

  const [selectedValues, setSelectedValues] = useState(Array(programaciones.length).fill(null)); // Array de estados para valores seleccionados
  const [popoverAnchorEls, setPopoverAnchorEls] = useState(Array(programaciones.length).fill(null));
  const handleOptionClick = (event, index) => {
    const updatedAnchors = [...popoverAnchorEls];
    updatedAnchors[index] = event.currentTarget;
    setPopoverAnchorEls(updatedAnchors);
  };
  const handlePopoverClose = (index) => {
    const updatedAnchors = [...popoverAnchorEls];
    updatedAnchors[index] = null;
    setPopoverAnchorEls(updatedAnchors);
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

  const [selectedValuesHipo, setSelectedValuesHipo] = useState(
    Array(programaciones.length).fill(null)
  ); // Array de estados para valores seleccionados
  const [popoverAnchorElsHipo, setPopoverAnchorElsHipo] = useState(
    Array(programaciones.length).fill(null)
  );
  const handleOptionClickHipo = (event, index) => {
    const updatedAnchors1 = [...popoverAnchorElsHipo];
    updatedAnchors1[index] = event.currentTarget;
    setPopoverAnchorElsHipo(updatedAnchors1);
  };
  const handlePopoverCloseHipo = (index) => {
    const updatedAnchors1 = [...popoverAnchorElsHipo];
    updatedAnchors1[index] = null;
    setPopoverAnchorElsHipo(updatedAnchors1);
  };

  const [selectedValuesHipopu, setSelectedValuesHipopu] = useState(
    Array(programaciones.length).fill(null)
  ); // Array de estados para valores seleccionados
  const [popoverAnchorElsHipopu, setPopoverAnchorElsHipopu] = useState(
    Array(programaciones.length).fill(null)
  );
  const handleOptionClickHipopu = (event, index) => {
    const updatedAnchors1 = [...popoverAnchorElsHipopu];
    updatedAnchors1[index] = event.currentTarget;
    setPopoverAnchorElsHipopu(updatedAnchors1);
  };
  const handlePopoverCloseHipopu = (index) => {
    const updatedAnchors1 = [...popoverAnchorElsHipopu];
    updatedAnchors1[index] = null;
    setPopoverAnchorElsHipopu(updatedAnchors1);
  };

  const [selectedValuesPure, setSelectedValuesPure] = useState(
    Array(programaciones.length).fill(null)
  ); // Array de estados para valores seleccionados
  const [popoverAnchorElsPure, setPopoverAnchorElsPure] = useState(
    Array(programaciones.length).fill(null)
  );
  const handleOptionClickPure = (event, index) => {
    const updatedAnchors1 = [...popoverAnchorElsPure];
    updatedAnchors1[index] = event.currentTarget;
    setPopoverAnchorElsPure(updatedAnchors1);
  };
  const handlePopoverClosePure = (index) => {
    const updatedAnchors1 = [...popoverAnchorElsPure];
    updatedAnchors1[index] = null;
    setPopoverAnchorElsPure(updatedAnchors1);
  };

  const [selectedValuesVege, setSelectedValuesVege] = useState(
    Array(programaciones.length).fill(null)
  ); // Array de estados para valores seleccionados
  const [popoverAnchorElsVege, setPopoverAnchorElsVege] = useState(
    Array(programaciones.length).fill(null)
  );
  const handleOptionClickVege = (event, index) => {
    const updatedAnchors1 = [...popoverAnchorElsVege];
    updatedAnchors1[index] = event.currentTarget;
    setPopoverAnchorElsVege(updatedAnchors1);
  };
  const handlePopoverCloseVege = (index) => {
    const updatedAnchors1 = [...popoverAnchorElsVege];
    updatedAnchors1[index] = null;
    setPopoverAnchorElsVege(updatedAnchors1);
  };

  const [selectedValuesComi, setSelectedValuesComi] = useState(
    Array(programaciones.length).fill(null)
  ); // Array de estados para valores seleccionados
  const [popoverAnchorElsComi, setPopoverAnchorElsComi] = useState(
    Array(programaciones.length).fill(null)
  );
  const handleOptionClickVComi = (event, index) => {
    const updatedAnchors1 = [...popoverAnchorElsComi];
    updatedAnchors1[index] = event.currentTarget;
    setPopoverAnchorElsComi(updatedAnchors1);
  };
  const handlePopoverCloseComi = (index) => {
    const updatedAnchors1 = [...popoverAnchorElsComi];
    updatedAnchors1[index] = null;
    setPopoverAnchorElsComi(updatedAnchors1);
  };

  const [selectedValuesHipo2, setSelectedValuesHipo2] = useState(
    Array(programaciones.length).fill(null)
  ); // Array de estados para valores seleccionados
  const [popoverAnchorElsHipo2, setPopoverAnchorElsHipo2] = useState(
    Array(programaciones.length).fill(null)
  );
  const handleOptionClickHipo2 = (event, index) => {
    const updatedAnchors1 = [...popoverAnchorElsHipo2];
    updatedAnchors1[index] = event.currentTarget;
    setPopoverAnchorElsHipo2(updatedAnchors1);
  };
  const handlePopoverCloseHipo2 = (index) => {
    const updatedAnchors1 = [...popoverAnchorElsHipo2];
    updatedAnchors1[index] = null;
    setPopoverAnchorElsHipo2(updatedAnchors1);
  };

  const [selectedValuesHipopu2, setSelectedValuesHipopu2] = useState(
    Array(programaciones.length).fill(null)
  ); // Array de estados para valores seleccionados
  const [popoverAnchorElsHipopu2, setPopoverAnchorElsHipopu2] = useState(
    Array(programaciones.length).fill(null)
  );
  const handleOptionClickHipopu2 = (event, index) => {
    const updatedAnchors1 = [...popoverAnchorElsHipopu2];
    updatedAnchors1[index] = event.currentTarget;
    setPopoverAnchorElsHipopu2(updatedAnchors1);
  };
  const handlePopoverCloseHipopu2 = (index) => {
    const updatedAnchors1 = [...popoverAnchorElsHipopu2];
    updatedAnchors1[index] = null;
    setPopoverAnchorElsHipopu2(updatedAnchors1);
  };

  const [selectedValuesPure2, setSelectedValuesPure2] = useState(
    Array(programaciones.length).fill(null)
  ); // Array de estados para valores seleccionados
  const [popoverAnchorElsPure2, setPopoverAnchorElsPure2] = useState(
    Array(programaciones.length).fill(null)
  );
  const handleOptionClickPure2 = (event, index) => {
    const updatedAnchors1 = [...popoverAnchorElsPure2];
    updatedAnchors1[index] = event.currentTarget;
    setPopoverAnchorElsPure2(updatedAnchors1);
  };
  const handlePopoverClosePure2 = (index) => {
    const updatedAnchors1 = [...popoverAnchorElsPure2];
    updatedAnchors1[index] = null;
    setPopoverAnchorElsPure2(updatedAnchors1);
  };
  const centerPopoverStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div style={{ justifyContent: "center" }}>
      <Card variant="h2" align="center">
        <CardHeader title="PROGRAMACIÓN DE MENUS - DIETAS" />
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
                  </Typography>

                  <div style={{ maxHeight: "100px", maxWidth: "200px", overflow: "auto" }}>
                    <TextField
                      onClick={(event) => handleOptionClick(event, index)}
                      value={selectedValues[index]} // Muestra el valor seleccionado en el TextField
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

                  <Popover
                    open={Boolean(popoverAnchorEls[index])}
                    anchorEl={popoverAnchorEls[index]}
                    onClose={() => handlePopoverClose(index)}
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
                            programacion && programacion.desayuno
                              ? preparaciones.filter((option) =>
                                  programacion.desayuno.includes(option.nombre_preparacion)
                                )
                              : []
                          }
                          onChange={(event, newValues) => {
                            const newSelectedIds = newValues.map(
                              (newValue) => newValue.nombre_preparacion
                            );
                            setSelectedValues((prevValues) => {
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
                          onClick={() => handlePopoverClose(index)}
                          variant="contained"
                          sx={{
                            alignItems: "center",
                            color: "#ffff",
                            backgroundColor: "#B122AF",
                            "&:hover": { backgroundColor: "#800080" },
                            //     margin: "0 auto", // Esto centrará el botón horizontalmente
                            //    width: "100%", // Define un ancho del 100% para el botón
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }} // Define el color personalizado
                        >
                          Guradar
                        </Button>
                      </div>
                    </Card>
                  </Popover>

                  {/*
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Desayuno
                  </Typography>
                 
                  <Autocomplete
                    onFocus={() => {
                      const newIsPopperOpenArray = [...isPopperOpenArray];
                      newIsPopperOpenArray[index] = true;
                      setIsPopperOpenArray(newIsPopperOpenArray);
                    }}
                    onBlur={() => {
                      const newIsPopperOpenArray = [...isPopperOpenArray];
                      newIsPopperOpenArray[index] = false;
                      setIsPopperOpenArray(newIsPopperOpenArray);
                    }}
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
                  <Popper
                    open={isPopperOpenArray[index]}
                    anchorEl={null}
                    onClose={(event) => {
                      if (event && event.target && !event.target.closest(".autocomplete-popover")) {
                        const newIsPopperOpenArray = [...isPopperOpenArray];
                        newIsPopperOpenArray[index] = false;
                        setIsPopperOpenArray(newIsPopperOpenArray);
                      }
                    }}
                  >
                    <div className="autocomplete-popover">
                      <Autocomplete
                        value={programacion.desayuno}
                        onChange={(event, newValues) => {
                          const newSelectedIds = newValues.map(
                            (newValue) => newValue.nombre_preparacion
                          );
                          handleInputChange(index, "desayuno", newSelectedIds);
                        }}
                        disablePortal
                        sx={{ width: "100%" }}
                        options={preparaciones}
                        getOptionLabel={(option) => option.nombre_preparacion}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props}>{option.nombre_preparacion}</li>
                        )}
                      />
                    </div>
                  </Popper>
 */}
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Almuerzo
                    {/* Desayuno {index + 1}: */}
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
                    open={Boolean(popoverAnchorElsAlm[index])} // Cambia a popoverAnchorElsAlm
                    anchorEl={popoverAnchorElsAlm[index]} // Cambia a popoverAnchorElsAlm
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
                            setSelectedValuesAlm((prevValues1) => {
                              const updatedValues1 = [...prevValues1];
                              updatedValues1[index] = newSelectedIds.join(", "); // Actualiza el valor en el array
                              return updatedValues1;
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
                          Guradar
                        </Button>
                      </div>
                    </Card>
                  </Popover>

                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Hipoglucido
                    {/* Desayuno {index + 1}: */}
                  </Typography>
                  <div style={{ maxHeight: "100px", maxWidth: "200px", overflow: "auto" }}>
                    <TextField
                      onClick={(event) => handleOptionClickHipo(event, index)}
                      value={selectedValuesHipo[index]} // Muestra el valor seleccionado en el TextField
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  {errorList[index] && errorList[index]["hipoglucido"] && (
                    <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                      {errorList[index]["hipoglucido"]}
                    </span>
                  )}
                  {/* <ArgonInput
                                        // required
                                        value={programacion.hipoglucido}
                                        onChange={(event) => handleInputChange(index, 'hipoglucido', event.target.value)}
                                    /> */}

                  <Popover
                    open={Boolean(popoverAnchorElsHipo[index])}
                    anchorEl={popoverAnchorElsHipo[index]}
                    onClose={() => handlePopoverCloseHipo(index)}
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
                        Agregar Hipoglucido
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
                            programacion.hipoglucido
                              ? preparaciones.filter((option) =>
                                  programacion.hipoglucido.includes(option.nombre_preparacion)
                                )
                              : []
                          }
                          onChange={(event, newValues) => {
                            const newSelectedIds = newValues.map(
                              (newValue) => newValue.nombre_preparacion
                            );
                            setSelectedValuesHipo((prevValues1) => {
                              const updatedValues1 = [...prevValues1];
                              updatedValues1[index] = newSelectedIds.join(", "); // Actualiza el valor en el array
                              return updatedValues1;
                            });
                            const updatedErrorList = { ...errorList };
                            if (updatedErrorList[index]) {
                              updatedErrorList[index].hipoglucido = "";
                            }
                            setErrorList(updatedErrorList);
                            setIdPreparacion(newSelectedIds);
                            handleInputChange(index, "hipoglucido", newSelectedIds); // Actualiza las preparaciones seleccionadas en el array
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
                          onClick={() => handlePopoverCloseHipo(index)}
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
                          Guradar
                        </Button>
                      </div>
                    </Card>
                  </Popover>

                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Hipopurinico
                  </Typography>
                  <div style={{ maxHeight: "100px", maxWidth: "200px", overflow: "auto" }}>
                    <TextField
                      onClick={(event) => handleOptionClickHipopu(event, index)}
                      value={selectedValuesHipopu[index]} // Muestra el valor seleccionado en el TextField
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  {errorList[index] && errorList[index]["hipopurinico"] && (
                    <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                      {errorList[index]["hipopurinico"]}
                    </span>
                  )}

                  <Popover
                    open={Boolean(popoverAnchorElsHipopu[index])}
                    anchorEl={popoverAnchorElsHipopu[index]}
                    onClose={() => handlePopoverCloseHipopu(index)}
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
                        Agregar Hipopurinico
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
                            programacion.hipopurinico
                              ? preparaciones.filter((option) =>
                                  programacion.hipopurinico.includes(option.nombre_preparacion)
                                )
                              : []
                          }
                          onChange={(event, newValues) => {
                            const newSelectedIds = newValues.map(
                              (newValue) => newValue.nombre_preparacion
                            );
                            setSelectedValuesHipopu((prevValues1) => {
                              const updatedValues1 = [...prevValues1];
                              updatedValues1[index] = newSelectedIds.join(", "); // Actualiza el valor en el array
                              return updatedValues1;
                            });
                            const updatedErrorList = { ...errorList };
                            if (updatedErrorList[index]) {
                              updatedErrorList[index].hipopurinico = "";
                            }
                            setErrorList(updatedErrorList);
                            setIdPreparacion(newSelectedIds);
                            handleInputChange(index, "hipopurinico", newSelectedIds); // Actualiza las preparaciones seleccionadas en el array
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
                          onClick={() => handlePopoverCloseHipopu(index)}
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
                          Guradar
                        </Button>
                      </div>
                    </Card>
                  </Popover>

                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Pure
                  </Typography>
                  <div style={{ maxHeight: "100px", maxWidth: "200px", overflow: "auto" }}>
                    <TextField
                      onClick={(event) => handleOptionClickPure(event, index)}
                      value={selectedValuesPure[index]} // Muestra el valor seleccionado en el TextField
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  {errorList[index] && errorList[index]["pure"] && (
                    <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                      {errorList[index]["pure"]}
                    </span>
                  )}
                  {/* <ArgonInput
                                        // required
                                        value={programacion.pure}
                                        onChange={(event) => handleInputChange(index, 'pure', event.target.value)}
                                    /> */}
                  <Popover
                    open={Boolean(popoverAnchorElsPure[index])}
                    anchorEl={popoverAnchorElsPure[index]}
                    onClose={() => handlePopoverClosePure(index)}
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
                        Agregar Pure
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
                            programacion.pure
                              ? preparaciones.filter((option) =>
                                  programacion.pure.includes(option.nombre_preparacion)
                                )
                              : []
                          }
                          onChange={(event, newValues) => {
                            const newSelectedIds = newValues.map(
                              (newValue) => newValue.nombre_preparacion
                            );
                            setSelectedValuesPure((prevValues1) => {
                              const updatedValues1 = [...prevValues1];
                              updatedValues1[index] = newSelectedIds.join(", "); // Actualiza el valor en el array
                              return updatedValues1;
                            });
                            const updatedErrorList = { ...errorList };
                            if (updatedErrorList[index]) {
                              updatedErrorList[index].pure = "";
                            }
                            setErrorList(updatedErrorList);
                            setIdPreparacion(newSelectedIds);
                            handleInputChange(index, "pure", newSelectedIds); // Actualiza las preparaciones seleccionadas en el array
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
                          onClick={() => handlePopoverClosePure(index)}
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
                          Guradar
                        </Button>
                      </div>
                    </Card>
                  </Popover>

                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Vegetariano
                  </Typography>

                  <div style={{ maxHeight: "100px", maxWidth: "200px", overflow: "auto" }}>
                    <TextField
                      onClick={(event) => handleOptionClickVege(event, index)}
                      value={selectedValuesVege[index]} // Muestra el valor seleccionado en el TextField
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  {errorList[index] && errorList[index]["vegetariano"] && (
                    <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                      {errorList[index]["vegetariano"]}
                    </span>
                  )}
                  {/* <ArgonInput
                                        type="text"
                                        value={programacion.vegetariano}
                                        onChange={(event) => handleInputChange(index, 'vegetariano', event.target.value)}
                                    /> */}
                  <Popover
                    open={Boolean(popoverAnchorElsVege[index])}
                    anchorEl={popoverAnchorElsVege[index]}
                    onClose={() => handlePopoverCloseVege(index)}
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
                        Agregar Comida Vegetariana
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
                            programacion.vegetariano
                              ? preparaciones.filter((option) =>
                                  programacion.vegetariano.includes(option.nombre_preparacion)
                                )
                              : []
                          }
                          onChange={(event, newValues) => {
                            const newSelectedIds = newValues.map(
                              (newValue) => newValue.nombre_preparacion
                            );
                            setSelectedValuesVege((prevValues1) => {
                              const updatedValues1 = [...prevValues1];
                              updatedValues1[index] = newSelectedIds.join(", "); // Actualiza el valor en el array
                              return updatedValues1;
                            });
                            const updatedErrorList = { ...errorList };
                            if (updatedErrorList[index]) {
                              updatedErrorList[index].vegetariano = "";
                            }
                            setErrorList(updatedErrorList);
                            setIdPreparacion(newSelectedIds);
                            handleInputChange(index, "vegetariano", newSelectedIds); // Actualiza las preparaciones seleccionadas en el array
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
                          onClick={() => handlePopoverCloseVege(index)}
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
                          Guradar
                        </Button>
                      </div>
                    </Card>
                  </Popover>

                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Comida
                  </Typography>

                  <div style={{ maxHeight: "100px", maxWidth: "200px", overflow: "auto" }}>
                    <TextField
                      onClick={(event) => handleOptionClickVComi(event, index)}
                      value={selectedValuesComi[index]} // Muestra el valor seleccionado en el TextField
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
                    open={Boolean(popoverAnchorElsComi[index])}
                    anchorEl={popoverAnchorElsComi[index]}
                    onClose={() => handlePopoverCloseComi(index)}
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
                        Agregar Solo Comida
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
                            setSelectedValuesComi((prevValues1) => {
                              const updatedValues1 = [...prevValues1];
                              updatedValues1[index] = newSelectedIds.join(", "); // Actualiza el valor en el array
                              return updatedValues1;
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
                          onClick={() => handlePopoverCloseComi(index)}
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
                          Guradar
                        </Button>
                      </div>
                    </Card>
                  </Popover>

                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Hipoglucido 2
                  </Typography>
                  <div style={{ maxHeight: "100px", maxWidth: "200px", overflow: "auto" }}>
                    <TextField
                      onClick={(event) => handleOptionClickHipo2(event, index)}
                      value={selectedValuesHipo2[index]} // Muestra el valor seleccionado en el TextField
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  {errorList[index] && errorList[index]["hipoglucido_2"] && (
                    <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                      {errorList[index]["hipoglucido_2"]}
                    </span>
                  )}
                  {/* <ArgonInput
                                        // required
                                        value={programacion.hipoglucido_2}
                                        onChange={(event) => handleInputChange(index, 'hipoglucido_2', event.target.value)}
                                    /> */}
                  <Popover
                    open={Boolean(popoverAnchorElsHipo2[index])}
                    anchorEl={popoverAnchorElsHipo2[index]}
                    onClose={() => handlePopoverCloseHipo2(index)}
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
                        Agregar Hipoglucido 2
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
                            programacion.hipoglucido_2
                              ? preparaciones.filter((option) =>
                                  programacion.hipoglucido_2.includes(option.nombre_preparacion)
                                )
                              : []
                          }
                          onChange={(event, newValues) => {
                            const newSelectedIds = newValues.map(
                              (newValue) => newValue.nombre_preparacion
                            );
                            setSelectedValuesHipo2((prevValues1) => {
                              const updatedValues1 = [...prevValues1];
                              updatedValues1[index] = newSelectedIds.join(", "); // Actualiza el valor en el array
                              return updatedValues1;
                            });
                            const updatedErrorList = { ...errorList };
                            if (updatedErrorList[index]) {
                              updatedErrorList[index].hipoglucido_2 = "";
                            }
                            setErrorList(updatedErrorList);
                            setIdPreparacion(newSelectedIds);
                            handleInputChange(index, "hipoglucido_2", newSelectedIds); // Actualiza las preparaciones seleccionadas en el array
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
                          onClick={() => handlePopoverCloseHipo2(index)}
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
                          Guradar
                        </Button>
                      </div>
                    </Card>
                  </Popover>

                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Hipopurinico 2
                  </Typography>
                  <div style={{ maxHeight: "100px", maxWidth: "200px", overflow: "auto" }}>
                    <TextField
                      onClick={(event) => handleOptionClickHipopu2(event, index)}
                      value={selectedValuesHipopu2[index]} // Muestra el valor seleccionado en el TextField
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  {errorList[index] && errorList[index]["hipopurinico_2"] && (
                    <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                      {errorList[index]["hipopurinico_2"]}
                    </span>
                  )}
                  {/* <ArgonInput
                                        // required
                                        value={programacion.hipopurinico_2}
                                        onChange={(event) => handleInputChange(index, 'hipopurinico_2', event.target.value)}
                                    /> */}
                  <Popover
                    open={Boolean(popoverAnchorElsHipopu2[index])}
                    anchorEl={popoverAnchorElsHipopu[index]}
                    onClose={() => handlePopoverCloseHipopu2(index)}
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
                        Agregar Hipoglucido 2
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
                            programacion.hipopurinico_2
                              ? preparaciones.filter((option) =>
                                  programacion.hipopurinico_2.includes(option.nombre_preparacion)
                                )
                              : []
                          }
                          onChange={(event, newValues) => {
                            const newSelectedIds = newValues.map(
                              (newValue) => newValue.nombre_preparacion
                            );
                            setSelectedValuesHipopu2((prevValues1) => {
                              const updatedValues1 = [...prevValues1];
                              updatedValues1[index] = newSelectedIds.join(", "); // Actualiza el valor en el array
                              return updatedValues1;
                            });
                            const updatedErrorList = { ...errorList };
                            if (updatedErrorList[index]) {
                              updatedErrorList[index].hipopurinico_2 = "";
                            }
                            setErrorList(updatedErrorList);
                            setIdPreparacion(newSelectedIds);
                            handleInputChange(index, "hipopurinico_2", newSelectedIds); // Actualiza las preparaciones seleccionadas en el array
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
                          onClick={() => handlePopoverCloseHipopu2(index)}
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
                          Guradar
                        </Button>
                      </div>
                    </Card>
                  </Popover>

                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Pure 2
                  </Typography>
                  <div style={{ maxHeight: "100px", maxWidth: "200px", overflow: "auto" }}>
                    <TextField
                      onClick={(event) => handleOptionClickPure2(event, index)}
                      value={selectedValuesPure2[index]} // Muestra el valor seleccionado en el TextField
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  {errorList[index] && errorList[index]["pure_2"] && (
                    <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                      {errorList[index]["pure_2"]}
                    </span>
                  )}
                  {/* <ArgonInput
                                        // required
                                        value={programacion.pure_2}
                                        onChange={(event) => handleInputChange(index, 'pure_2', event.target.value)}
                                    /> */}

                  <Popover
                    open={Boolean(popoverAnchorElsPure2[index])}
                    anchorEl={popoverAnchorElsPure2[index]}
                    onClose={() => handlePopoverClosePure2(index)}
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
                        Agregar Pure 2
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
                            programacion.pure_2
                              ? preparaciones.filter((option) =>
                                  programacion.pure_2.includes(option.nombre_preparacion)
                                )
                              : []
                          }
                          onChange={(event, newValues) => {
                            const newSelectedIds = newValues.map(
                              (newValue) => newValue.nombre_preparacion
                            );
                            setSelectedValuesPure2((prevValues1) => {
                              const updatedValues1 = [...prevValues1];
                              updatedValues1[index] = newSelectedIds.join(", "); // Actualiza el valor en el array
                              return updatedValues1;
                            });
                            const updatedErrorList = { ...errorList };
                            if (updatedErrorList[index]) {
                              updatedErrorList[index].pure_2 = "";
                            }
                            setErrorList(updatedErrorList);
                            setIdPreparacion(newSelectedIds);
                            handleInputChange(index, "pure_2", newSelectedIds); // Actualiza las preparaciones seleccionadas en el array
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
                          onClick={() => handlePopoverClosePure2(index)}
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
                          Guradar
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
              <Link to={"/programadietas"} style={{ color: "white" }}>
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
