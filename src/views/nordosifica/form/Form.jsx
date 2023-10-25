
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

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Api_URL } from "config/Api_URL";
import ClearIcon from '@mui/icons-material/Clear';

const URI = Api_URL + "dosificanormales/";
const URI1 = Api_URL + "preparaciones/";
const URI2 = Api_URL + "productos/";
const URI3 = Api_URL + "pedidosnormales/";

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

/* fin del componente autocomplete*/

const Form = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const [fechaDosificacion, setFechaDosificacion] = useState('');
    const [cantSalidaDosificacion, setCantSalidaDosificacion] = useState('');
    const [alimentoDosificacion, setAlimentoDosificacion] = useState('');//ver
    const [estadoDosificacion, setEstadoDosificacion] = useState('');
    const [pedidoNormalId, setPedidoNormalId] = useState('');
    const [cantPedido, setCantPedido] = useState('');//ver
    const [idProducto, setIdProducto] = useState([]);

    const [pedidos, setPedidos] = useState([]);
    const [preparaciones, setPreparaciones] = useState([]);
    const [preparacionesPlanillon, setPreparacionesPlanillon] = useState([]);
    const [productosPedido, setProductosPedido] = useState([]);
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        getProductos();
        getPreparaciones();
        getPedidos();
        if (id) {
            getDosificacion();
        }
    }, []);

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

    const getPedidos = async () => {
        const response = await axios.get(URI3)
        setPedidos(response.data)
    }

    const getDosificacion = async () => {

        try {
            const response = await axios.get(`${URI}${id}`);
            setFechaDosificacion(response.data.fecha_dosificacion);
            setAlimentoDosificacion(response.data.alimento_dosificacion);
            setEstadoDosificacion(response.data.estado_dosificacion);
            setPedidoNormalId(response.data.pedido_normals_id);

            const preparacionesEnRespuesta = response.data.preparacions;
            const productosEnRespuesta = response.data.productos;
            setPreparacionesPlanillon(
                preparacionesEnRespuesta.map((preparacion) => ({
                    id_2: preparacion?.id,
                    nombre_preparacion: preparacion?.nombre_preparacion,
                    nombre_producto: preparacion?.producto?.catalogo?.nombre_producto,
                    productos: preparacion?.productos,
                    cantidad_salida: preparacion.pivot.cantidad_salida,
                    //existencias: insumo.existencias
                }))
            );

            // setPreparacionesPlanillon(response.data.preparacions.map((preparacion) => ({
            //     id_2: preparacion?.id,
            //     nombre_preparacion: preparacion?.nombre_preparacion,
            //     nombre_producto: preparacion?.producto?.catalogo?.nombre_producto,
            //     productos: preparacion?.productos,

            // })));

            setProductosPedido(
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

            // setProductosPedido(response.data.productos.map((producto) => ({
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
                    pedido_normals_id: pedidoNormalId,
                    producto_id: productosPedido.map((item) => ({
                        id: item.id || item.id_2,
                        obs_salida: item.obs_salida,
                        cantidad_salida: item.cantidad_salida,
                    })),
                    preparacion_id: preparacionesPlanillon.map((item) => ({
                        id: item.id || item.id_2,
                        // obs_salida: item.obs_salida,
                        cantidad_salida: item.cantidad_salida,
                    })),


                });
            } else {
                await axios.post(URI, {
                    fecha_dosificacion: fechaDosificacion,
                    alimento_dosificacion: alimentoDosificacion,
                    estado_dosificacion: estadoDosificacion,
                    pedido_normals_id: pedidoNormalId,
                    producto_id: productosPedido,
                    preparacion_id: preparacionesPlanillon
                });
            }
            navigate('/dosificanormales')

        } catch (error) {
            console.error(error);
        }
    };

    // const handlePreparacionChange = (index, field, value) => {
    //     const updatedPreparacion = [...productosPedido];
    //     updatedPreparacion[index][field] = value;
    //     setProductosPedido(updatedPreparacion);
    // };
    const handlePreparacionChange = (index, field, value) => {
        const updatedPreparacion = [...preparacionesPlanillon];
        updatedPreparacion[index][field] = value;
        setPreparacionesPlanillon(updatedPreparacion);
    };
    const handleProductoChange = (index, field, value) => {
        const updatedProductos = [...productosPedido];
        updatedProductos[index][field] = value;
        setProductosPedido(updatedProductos);
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

                    title={id ? 'ACTUALIZAR DOSIFICACION NORMAL' : 'REGISTRAR DOSIFICACION NORMAL'}
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
                                        Seleccione Pedido:
                                    </Typography>

                                    <Autocomplete
                                        value={
                                            pedidoNormalId
                                                ? pedidos.find((option) => {
                                                    return pedidoNormalId === option.id;
                                                }) ?? null
                                                : null
                                        }

                                        onChange={(event, newValue) => {
                                            setPedidoNormalId(newValue ? newValue.id : null);
                                            if (newValue) {
                                                setFechaDosificacion(newValue.fecha_pedido);
                                                setAlimentoDosificacion(newValue.alimento);
                                                setCantPedido(newValue.cant_personal);
                                                const preparacionesPlanillon = newValue.planillon_normal?.preparacions;
                                                setPreparacionesPlanillon(preparacionesPlanillon);
                                                const productosPedido = newValue.planillon_normal?.productos;
                                                setProductosPedido(productosPedido);
                                            } else {
                                                setFechaDosificacion('');
                                                setAlimentoDosificacion('');
                                                setCantPedido('');
                                                setPreparacionesPlanillon('');
                                                setProductosPedido('');

                                            }
                                        }}

                                        disablePortal

                                        sx={{ width: '100%', height: '100%' }}

                                        disableListWrap
                                        PopperComponent={StyledPopper}
                                        ListboxComponent={ListboxComponent}

                                        options={pedidos}

                                        getOptionLabel={(option) => option.fecha_pedido + ' ' + option.alimento}

                                        renderInput={(params) => <TextField  {...params} />}

                                        renderOption={(props, option, state) => [props, option.fecha_pedido + ' ' + option.alimento, state.index]}
                                        // renderOption={(props, option, state) => [props,  , option.id + " " + option.nombre_ambiente]}
                                        renderGroup={(params) => params}
                                        disabled={id ? true : false}
                                    />
                                </Item>
                            </Grid>
                            <Grid item xs={3}>
                                <Item>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Fecha Dosificado
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

                                    <ThemeProvider theme={theme}>

                                        <ArgonBox mb={3}>

                                            <TableContainer component={Paper}>

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
                                                            }}>Para 1</TableCell>
                                                            <TableCell sx={{
                                                                backgroundColor: '#344767',
                                                                fontWeight: 'bold',
                                                                border: '1px solid white',
                                                                color: 'white',
                                                                textAlign: 'center'
                                                            }}>Para {cantPedido}</TableCell>
                                                            <TableCell sx={{
                                                                backgroundColor: '#344767',
                                                                fontWeight: 'bold',
                                                                border: '1px solid white',
                                                                color: 'white',
                                                                textAlign: 'center'
                                                            }}>Dosificacion Total</TableCell>


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
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    {/* {preparacion.cantidad_salida === 0 ? ( */}
                                                                    <TextField
                                                                        sx={{ width: "155px" }}
                                                                        color="primary"
                                                                        type="number"
                                                                        value={preparacion.cantidad_salida || cantPedido}
                                                                        onChange={(e) => {
                                                                            const newValue = parseFloat(e.target.value);
                                                                            if (!isNaN(newValue)) {
                                                                                handlePreparacionChange(index, "cantidad_salida", newValue);
                                                                            }
                                                                        }}
                                                                    />
                                                                    {/* ) : (
                                                                        preparacion.cantidad_salida
                                                                    )} */}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {preparacion.productos && preparacion.productos.map((producto, productoIndex) => (
                                                                        <div key={productoIndex}>
                                                                            {(preparacion.cantidad_salida == null
                                                                                ? producto?.pivot?.cantidad_preparacion * cantPedido
                                                                                : producto?.pivot?.cantidad_preparacion * preparacion.cantidad_salida).toFixed(2)}
                                                                        </div>
                                                                    ))}
                                                                </TableCell>
                                                                {/* <TableCell>
                                                                    {preparacion.productos && preparacion.productos.map((producto, productoIndex) => (
                                                                        <div key={productoIndex}>
                                                                            {preparacion.cantidad_salida !== null && preparacion.cantidad_salida !== undefined
                                                                                ? producto?.pivot?.cantidad_preparacion * cantPedido
                                                                                :  preparacion.cantidad_salida}
                                                                        </div>
                                                                    ))}
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
                                                            }}>Para {cantPedido}</TableCell>
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
                                                        {productosPedido.map((producto, index) => (
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
                                                                        value={producto.cantidad_salida || cantPedido} // Usar el valor de producto.cantidad_salida si está definido, de lo contrario, usar cantPedido
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
                            <Link to={'/dosificanormales'}
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