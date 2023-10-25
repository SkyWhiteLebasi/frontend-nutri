
import React, { useState, useEffect } from 'react';

import ArgonBox from "components/ArgonBox";
import Card from "@mui/material/Card";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";

import { styled } from '@mui/material/styles';

import { Button, Box } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Link } from "react-router-dom";

import PropTypes from 'prop-types';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import Popper from '@mui/material/Popper';
import { useTheme } from '@mui/material/styles';
import { VariableSizeList } from 'react-window';
import Typography from '@mui/material/Typography';
import { ListSubheader } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import { Divider } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
// import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Api_URL } from "config/Api_URL";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ClearIcon from '@mui/icons-material/Clear';

// const URI = "http://127.0.0.1:8000/api/pedidodpisos/"

// const URI1 = "http://127.0.0.1:8000/api/planillondietas/";

// const URI2 = "http://127.0.0.1:8000/api/pisos/";

// const URI3 = "http://127.0.0.1:8000/api/preparaciones/";

const URI = Api_URL + "dosificadietas/";
const URI1 = Api_URL + "preparaciones/";
const URI2 = Api_URL + "productos/";
const URI3 = Api_URL + "planillondietas/";
const URI4 = Api_URL + "reporte_dietas/";

const theme = createTheme({
    components: {
        MuiGridToolbar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                    color: 'red',
                },
            },
        },
    },
});

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
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

    if (dataSet.hasOwnProperty('group')) {
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
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
        noSsr: true,
    });
    const itemCount = itemData.length;
    const itemSize = smUp ? 26 : 38;

    const getChildSize = (child) => {
        if (child.hasOwnProperty('group')) {
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
        boxSizing: 'border-box',
        '& ul': {
            padding: 0,
            margin: 0,
        },
    },
});

const Form = () => {

    const { id } = useParams()

    const navigate = useNavigate()

    const [fechaDosificacion, setFechaDosificacion] = useState('');
    const [alimentoDosificacion, setAlimentoDosificacion] = useState('');//ver
    const [estadoDosificacion, setEstadoDosificacion] = useState('');
    const [idProducto, setIdProducto] = useState([]);
    const [planillonDietaId, setPlanillonDietaId] = useState('');

    const [idPedidoPreparacion, setIdPedidoPreparacion] = useState([]);

    const [planillones, setPlanillones] = useState([]);
    const [preparaciones, setPreparaciones] = useState([]);
    const [preparacionesPlanillon, setPreparacionesPlanillon] = useState([]);
    const [productosPedido, setProductosPedido] = useState([]);
    const [productos, setProductos] = useState([]);
    const [reporteDieta, setReporteDieta] = useState([]);

    useEffect(() => {
        getPlanillon();
        getPreparaciones();
        getProductos();
        getReporteDieta();
        if (id) {
            getDosificacionDietetica();
        }
    }, []);

    //Obtiene los datos para el autocomplete
    const getPlanillon = async () => {
        const response = await axios.get(URI3)
        setPlanillones(response.data)
    }
    const getReporteDieta= async () => {
        const response = await axios.get(URI4)
        setReporteDieta(response.data)
    }

    const getPreparaciones = async () => {
        const response = await axios.get(URI1, {
            params: {
                includeProductos: true // Agrega un parámetro para indicar que quieres incluir los productos
            }
        });

        // Ahora la respuesta debe incluir las preparaciones con la propiedad "productos"
        setPreparaciones(response.data);
    }
    const getProductos = async () => {
        const response = await axios.get(URI2)
        setProductos(response.data)
    }

    //Obtiene los datos para editar
    const getDosificacionDietetica = async () => {
        try {
            const response = await axios.get(`${URI}${id}`);
            setFechaDosificacion(response.data.fecha_dosificacion);
            setAlimentoDosificacion(response.data.alimento_dosificacion);
            setEstadoDosificacion(response.data.estado_dosificacion);
            setPlanillonDietaId(response.data.planillon_dieta_id);
            // setPisoId(response.data.piso_id);

            const preparacionesEnRespuesta = response.data.preparacions;
            const productosEnRespuesta = response.data.productos;
            setPreparacionesPlanillon(
                preparacionesEnRespuesta.map((preparacion) => ({
                    id_2: preparacion?.id,
                    nombre_preparacion: preparacion?.nombre_preparacion,
                    nombre_producto: preparacion?.producto?.catalogo?.nombre_producto,
                    productos: preparacion?.productos,
                    cantidad_salida: preparacion.pivot.cantidad_salida,
                    obs_salida: preparacion.pivot.obs_salida,
                    //existencias: insumo.existencias
                }))
            );
            // setPreparacionesPlanillon(response.data.preparacions.map((preparacion) => ({
            //     id_2: preparacion?.id,
            //     nombre_preparacion: preparacion.nombre_preparacion,
            //     obs_preparacion: preparacion.obs_preparacion,
            //     nombre_producto: preparacion?.producto?.catalogo?.nombre_producto,
            //     productos: preparacion?.productos,
            //     // cantidad_preparacion: producto.pivot.cantidad_preparacion,
            // })));

            // setIdPedidoPreparacion(
            //     response.data.preparaciones.map((preparacion) => ({
            //         id_2: preparacion?.id,
            //         nombre_preparacion: preparacion.nombre_preparacion,
            //         obs_pedido: preparacion.pivot.obs_pedido,
            //         // cantidad_pedido_normal: preparacion.pivot.cantidad_pedido_normal,
            //         cantidad_pedido_modificado: preparacion.pivot.cantidad_pedido_modificado,

            //         //existencias: insumo.existencias
            //     }))
            // );
            setIdProducto(
                productosEnRespuesta.map((producto) => ({
                    id_2: producto?.id,
                    // nombre_pro: producto.nombre_producto,
                    nombre_producto: producto?.catalogo?.nombre_producto,
                    medida_producto: producto?.catalogo?.medida_producto,
                    cantidad_salida: producto?.pivot.cantidad_salida,
                    obs_salida: producto?.pivot.obs_salida
                    //existencias: insumo.existencias
                }))
            );
            // setIdProducto(response.data.productos.map((producto) => ({
            //     id_2: producto?.id,
            //     // nombre_pro: producto.nombre_producto,
            //     nombre_producto: producto?.catalogo?.nombre_producto,
            //     medida_producto: producto?.catalogo?.medida_producto

            // })));


        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit_1 = async (event) => {
        try {
            event.preventDefault();
            if (id) {
                await axios.put(`${URI}${id}`, {
                    fecha_dosificacion: fechaDosificacion,
                    alimento_dosificacion: alimentoDosificacion,
                    estado_dosificacion: estadoDosificacion,
                    planillon_dieta_id: planillonDietaId,
                    // piso_id: pisoId,
                    preparacion_id: preparacionesPlanillon.map((item) => ({
                        id: item.id || item.id_2,
                        cantidad_salida: item.cantidad_salida,
                        cantidad_salida_observada: item.cantidad_salida_observada,
                        obs_salida: item.obs_salida,
                    })),
                    producto_id: idProducto.map((item) => ({
                        id: item.id || item.id_2,
                        cantidad_salida: item.cantidad_salida,
                        cantidad_salida_observada: item.cantidad_salida_observada,
                        obs_salida: item.obs_salida,
                    }))
                });


            } else {
                await axios.post(URI, {
                    fecha_dosificacion: fechaDosificacion,
                    alimento_dosificacion: alimentoDosificacion,
                    estado_dosificacion: estadoDosificacion,
                    planillon_dieta_id: planillonDietaId,
                    preparacion_id: preparacionesPlanillon,
                    producto_id: idProducto

                });
            }
            navigate('/dosificadietas')

            //setNombreAmbientes('');
        } catch (error) {
            console.error(error);
        }
    };
    const handlePreparacionChange = (index, field, value) => {
        const updatedPreparacion = [...preparacionesPlanillon];
        updatedPreparacion[index][field] = value;
        setPreparacionesPlanillon(updatedPreparacion);
    };
    const handleProductoChange = (index, field, value) => {
        const updatedProductos = [...idProducto];
        updatedProductos[index][field] = value;
        setIdProducto(updatedProductos);
    };
    const handleAutocompleChange = (event, value) => {
        if (value) {
            setIdPedidoPreparacion([...idPedidoPreparacion, value]);//new
        }
    };
    const handleElimiFila = (index) => {
        setIdPedidoPreparacion(idPedidoPreparacion.filter((_, i) => i !== index));//new
    };
    const CustomButton = styled(Button)(({ theme }) => ({
        '&:hover': {
            backgroundColor: 'green', // Reemplaza 'new color' por el color deseado para el hover
        },
    }));


    return (

        <Card>
            <ArgonBox p={1} mb={1} textAlign="center">

                <CardHeader

                    title={id ? 'ACTUALIZAR DOSIFICACION DIETA' : 'REGISTRAR DOSIFICACION DIETA'}
                />
            </ArgonBox>
            {/* <hr color='#11cdef' size='8px'/> */}
            <Divider sx={{ my: -1.5, backgroundColor: 'lightdark', height: 4 }} />
            <ArgonBox pt={2} pb={3} px={6}>

                <ArgonBox component="form" role="form" onSubmit={handleSubmit_1}>

                    <Box sx={{ width: '100%' }}>
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
                                                setFechaDosificacion(newValue.fecha_planillon);
                                                setAlimentoDosificacion(newValue.alimento?.nombre_alimento);
                                                // const preparacionNombres = newValue.preparacions.map(preparacion => preparacion.nombre_preparacion).join(', ');
                                                // const productoNombres = newValue.productos.map(producto => producto.catalogo?.nombre_producto).join(', ');

                                                // const detalleTexto = `PREPARACIONES: ${preparacionNombres}  PRODUCTOS: ${productoNombres}`;
                                                // const preparacionesPlanillon = newValue.preparacions;
                                                const preparacionesPlanillon = newValue.preparacions;
                                                const idProducto = newValue.productos;
                                                setPreparacionesPlanillon(preparacionesPlanillon);
                                                // setIdPedidoPreparacion(preparacionesPlanillon);
                                                setIdProducto(idProducto);
                                                // setDetalle(detalleTexto);
                                                // setDetalle(newValue.preparacions?.nombre_preparacion + ' ' + newValue.productos?.catalogo?.nombre_producto);
                                                // const [regimenPlanillon, setRegimenPlanillon] = useState('');
                                                // setFechaFin(newValue.fecha_fin);
                                            } else {
                                                setFechaDosificacion('');
                                                setAlimentoDosificacion('');
                                                setPreparacionesPlanillon('');
                                                setIdProducto('');
                                                // setAlimento('');
                                                // setFechaFin('');
                                            }
                                        }}

                                        disablePortal

                                        sx={{ width: '100%', height: '100%' }}

                                        disableListWrap
                                        PopperComponent={StyledPopper}
                                        ListboxComponent={ListboxComponent}

                                        options={planillones}

                                        getOptionLabel={(option) => option.fecha_planillon + ' ' + option.alimento?.nombre_alimento}

                                        renderInput={(params) => <TextField  {...params} />}

                                        renderOption={(props, option, state) => [props, option.fecha_planillon + ' ' + option.alimento?.nombre_alimento, state.index]}
                                        // renderOption={(props, option, state) => [props,  , option.id + " " + option.nombre_ambiente]}
                                        renderGroup={(params) => params}
                                        disabled={id ? true : false}
                                    />
                                </Item>
                            </Grid>
                            <Grid item xs={3}>
                                <Item>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Fecha Dosificacion
                                    </Typography>

                                    <ArgonInput
                                        value={fechaDosificacion}
                                        onChange={(event) => setFechaDosificacion(event.target.value)}
                                    />
                                </Item>
                            </Grid>


                            <Grid item xs={3}>
                                <Item>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Alimento
                                    </Typography>

                                    <ArgonInput
                                        type="text"
                                        value={alimentoDosificacion}
                                        onChange={(event) => setAlimentoDosificacion(event.target.value)}
                                    />
                                </Item>
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
                                                <Typography p={1} sx={{ mb: 1.5, textAlign: 'center' }} color="text.secondary">
                                                    Lista de Preparaciones:
                                                </Typography>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{
                                                                backgroundColor: '#344767',
                                                                fontWeight: 'bold',
                                                                border: '1px solid white',
                                                                color: 'white'
                                                            }}>Item</TableCell>
                                                            <TableCell sx={{
                                                                backgroundColor: '#344767',
                                                                fontWeight: 'bold',
                                                                border: '1px solid white',
                                                                color: 'white',
                                                                textAlign: 'center'
                                                            }}>Preparacion</TableCell>
                                                            <TableCell sx={{
                                                                backgroundColor: '#344767',
                                                                fontWeight: 'bold',
                                                                border: '1px solid white',
                                                                color: 'white',
                                                                textAlign: 'center'
                                                            }}>Productos</TableCell>
                                                            <TableCell sx={{
                                                                backgroundColor: '#344767',
                                                                fontWeight: 'bold',
                                                                border: '1px solid white',
                                                                color: 'white',
                                                                textAlign: 'center'
                                                            }}>Para uno</TableCell>
                                                            <TableCell sx={{
                                                                backgroundColor: '#344767',
                                                                fontWeight: 'bold',
                                                                border: '1px solid white',
                                                                color: 'white',
                                                                textAlign: 'center'
                                                            }}>Inidicar cantidad</TableCell>
                                                            <TableCell sx={{
                                                                backgroundColor: '#344767',
                                                                fontWeight: 'bold',
                                                                border: '1px solid white',
                                                                color: 'white',
                                                                textAlign: 'center'
                                                            }}>Dosifica Total </TableCell>


                                                            <TableCell sx={{
                                                                backgroundColor: '#344767',
                                                                fontWeight: 'bold',
                                                                border: '1px solid white',
                                                                color: 'white',
                                                                textAlign: 'center'
                                                            }}>Observacion</TableCell>
                                                        </TableRow>

                                                    </TableHead>
                                                    <TableBody>
                                                        {preparacionesPlanillon.map((preparacion, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell>{preparacion.nombre_preparacion}</TableCell>

                                                                <TableCell>
                                                                    {/* Mapea los productos asociados a esta preparación */}
                                                                    {preparacion.productos && preparacion.productos.map((producto, productoIndex) => (
                                                                        <div key={productoIndex}>
                                                                            {producto?.catalogo?.nombre_producto || producto.nombre_producto}
                                                                        </div>
                                                                    ))}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {preparacion.productos && preparacion.productos.map((producto, productoIndex) => (
                                                                        <div key={productoIndex}>
                                                                            {producto?.pivot?.cantidad_preparacion}
                                                                        </div>
                                                                    ))}
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
                                                                        value={preparacion.cantidad_salida}
                                                                        onChange={(e) =>
                                                                            handlePreparacionChange(index, "cantidad_salida", e.target.value)
                                                                        }
                                                                    />

                                                                </TableCell>
                                                                {/* <TableCell>
                                                                    {preparacion.productos && preparacion.productos.map((producto, productoIndex) => (
                                                                        <div key={productoIndex}>
                                                                            {producto?.pivot?.cantidad_preparacion * preparacion.cantidad_salida}
                                                                        </div>
                                                                    ))}
                                                                </TableCell> */}
                                                                <TableCell>
                                                                    {preparacion.productos && preparacion.productos.map((producto, productoIndex) => (
                                                                        <div key={productoIndex}>
                                                                            {(producto?.pivot?.cantidad_preparacion * preparacion.cantidad_salida).toFixed(2)}
                                                                        </div>
                                                                    ))}
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
                                                                        type="text"
                                                                        color="primary"
                                                                        value={preparacion.obs_salida}
                                                                        onChange={(e) =>
                                                                            handlePreparacionChange(index, "obs_salida", e.target.value)
                                                                        }
                                                                    />

                                                                </TableCell>

                                                                {/* <TableCell>
                                                                    <ArgonBox onClick={() => handleElimiFila(index)}
                                                                        sx={{
                                                                            color: 'red',
                                                                            textAlign: 'center',
                                                                            fontSize: '23px',
                                                                            '&:hover': {
                                                                                cursor: 'pointer',
                                                                                transform: 'scale(1.2)',
                                                                            },
                                                                        }}
                                                                    >

                                                                        <Button variant="outlined" startIcon={<ClearIcon fontSize="" />} size="medium" style={{ fontSize: '14px' }} color="error">
                                                                            QUITAR
                                                                        </Button>


                                                                    </ArgonBox>
                                                                </TableCell> */}
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

                                    <ThemeProvider theme={theme}>

                                        <ArgonBox mb={3}>

                                            <TableContainer component={Paper}>

                                                <Typography p={1} sx={{ mb: 1.5, textAlign: 'center' }} color="text.secondary">
                                                    Lista de Productos:
                                                </Typography>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{
                                                                backgroundColor: '#344767',
                                                                fontWeight: 'bold',
                                                                border: '1px solid white',
                                                                color: 'white'
                                                            }}>Item</TableCell>
                                                            <TableCell sx={{
                                                                backgroundColor: '#344767',
                                                                fontWeight: 'bold',
                                                                border: '1px solid white',
                                                                color: 'white',
                                                                textAlign: 'center'
                                                            }}>Producto</TableCell>
                                                            <TableCell sx={{
                                                                backgroundColor: '#344767',
                                                                fontWeight: 'bold',
                                                                border: '1px solid white',
                                                                color: 'white',
                                                                textAlign: 'center'
                                                            }}>Unidad de Medida</TableCell>
                                                            <TableCell sx={{
                                                                backgroundColor: '#344767',
                                                                fontWeight: 'bold',
                                                                border: '1px solid white',
                                                                color: 'white',
                                                                textAlign: 'center'
                                                            }}>Cantidad</TableCell>
                                                            <TableCell sx={{
                                                                backgroundColor: '#344767',
                                                                fontWeight: 'bold',
                                                                border: '1px solid white',
                                                                color: 'white',
                                                                textAlign: 'center'
                                                            }}>Observacion</TableCell>


                                                        </TableRow>

                                                    </TableHead>
                                                    <TableBody>
                                                        {idProducto.map((producto, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell>{producto.nombre_producto || producto?.catalogo?.nombre_producto}</TableCell>

                                                                <TableCell>
                                                                    {producto.medida_producto || producto?.catalogo?.medida_producto}
                                                                </TableCell>
                                                                <TableCell
                                                                    sx={{
                                                                        fontWeight: "bold",
                                                                        border: "1px solid white",
                                                                        //color: 'white',
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    {/* <TextField
                                                                        sx={{ width: "155px" }}
                                                                        // type="number"
                                                                        color="primary"
                                                                        
                                                                        value={producto.cantidad_salida }
                                                                        //onChange={(event) => setIdInsumo(event.target.value)}
                                                                        onChange={(e) =>
                                                                            handlePreparacionChange(index, "cantidad_salida", e.target.value)
                                                                        }
                                                                    /> */}
                                                                    <TextField
                                                                        sx={{ width: "155px" }}
                                                                        type="number"
                                                                        color="primary"
                                                                        value={producto.cantidad_salida} // Usar el valor de producto.cantidad_salida si está definido, de lo contrario, usar cantPedido
                                                                        onChange={(e) => {
                                                                            handleProductoChange(index, "cantidad_salida", e.target.value);
                                                                            // setCantPedido(e.target.value); // Actualizar cantPedido con el nuevo valor ingresado
                                                                        }}
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
                                                                        type="text"
                                                                        color="primary"
                                                                        value={producto.obs_salida}
                                                                        //onChange={(event) => setIdInsumo(event.target.value)}
                                                                        onChange={(e) =>
                                                                            handleProductoChange(index, "obs_salida", e.target.value)
                                                                        }
                                                                    />
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


                            {/* <Grid item xs={12}>
                                <Item>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Observacion (Opcional):
                                    </Typography>

                                    <ArgonInput
                                        type="text"
                                        value={obsPedido}
                                        onChange={(event) => setObsPedido(event.target.value)}
                                    />
                                </Item>
                            </Grid> */}



                        </Grid>
                    </Box>
                    <ArgonBox display="flex" justifyContent="center" mt={4} mb={2}>
                        <CustomButton
                            px={1}
                            type="submit"
                            variant="contained"
                            sx={{
                                'color': {
                                    background: '#f2762e',
                                    color: 'white',
                                    width: '25%',
                                    display: 'flex',
                                    justifyContent: 'center',

                                },
                                '&:hover': {
                                    backgroundColor: '#d25c26', // Reemplaza 'new color' por el color deseado para el hover
                                },
                                marginRight: '10px'

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
                                'color': {
                                    background: '#058bbe',
                                    color: 'white',
                                    width: '25%',
                                    display: 'flex',
                                    justifyContent: 'center',

                                },
                                '&:hover': {
                                    backgroundColor: '#0a7eb4', // Reemplaza 'new color' por el color deseado para el hover
                                },
                            }}
                            fullWidth
                        >
                            <Link to={'/dosificadietas'}
                                style={{ color: 'white' }}>
                                Cancelar</Link>
                        </CustomButton>

                    </ArgonBox>
                    <ArgonBox mt={2}>
                        <ArgonTypography variant="button" color="text" fontWeight="regular">
                            <i>*Revise los datos antes de guardar&nbsp;*</i>
                        </ArgonTypography>
                    </ArgonBox>
                </ArgonBox>
            </ArgonBox>


        </Card >
    );
};

export default Form;
