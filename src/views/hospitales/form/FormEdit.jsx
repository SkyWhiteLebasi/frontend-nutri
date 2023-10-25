
import React, { useState, useEffect } from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import ArgonBox from "components/ArgonBox";
import Card from "@mui/material/Card";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";

import { styled } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button, Box } from '@mui/material';
import { Link } from "react-router-dom";
import CardHeader from '@mui/material/CardHeader';
import { Divider } from '@mui/material';

import Typography from '@mui/material/Typography';
import { Api_URL } from "config/Api_URL";
const URI = "hospitales/";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
const Form = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    //   const [nombreAmbientes, setNombreAmbientes] = useState('');
    const [nombreHospital, setNombreHospital] = useState('');
    const [codHospital, setCodHospital] = useState('');
    // const [ubicacion, setUbicacion] = useState('');
    // const [servintern, setServIntern] = useState('');

    useEffect(() => {
        if (id) {
            //   obtenerAmbiente();
            getHospital();

        }
    }, []);

    const getHospital = async () => {
        try {
            const response = await axios.get(`${URI}${id}`);
            //   setNombreAmbientes(response.data.nombre_ambiente);
            setNombreHospital(response.data.desc_red);
            setCodHospital(response.data.cod_red);
            // setUbicacion(response.data.ubicacion);
            // setServIntern(response.data.servintern);
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
                await axios.put(`${URI}${id}`, {
                    //   nombre_ambiente: nombreAmbientes,
                    desc_red: nombreHospital,
                    cod_red: codHospital,
                    // ubicacion: ubicacion,
                    // servintern: servintern,

                });

            } else {
                await axios.post(URI, {
                    //   nombre_ambiente: nombreAmbientes,
                    desc_red: nombreHospital,
                    cod_red: codHospital,
                    // ubicacion: ubicacion,
                    // servintern: servintern,

                });
            }
            navigate('/hospitales')

            //setNombreAmbientes('');
        } catch (error) {
            console.error(error);
        }
    };

    const CustomButton = styled(Button)(({ theme }) => ({
        '&:hover': {
            backgroundColor: 'green', // Reemplaza 'new color' por el color deseado para el hover
        },
    }));


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card>
                <ArgonBox p={1} mb={1} textAlign="center">
                    {/* <ArgonTypography variant="h5" fontWeight="medium">
                    Registrar Personal
                </ArgonTypography> */}
                    <CardHeader

                        title="REGISTRAR NUEVO HOSPITAL"
                    />
                </ArgonBox>
                {/* <hr color='#11cdef' size='8px'/> */}
                <Divider sx={{ my: -1.5, backgroundColor: 'lightdark', height: 4 }} />

                <ArgonBox pt={2} pb={3} px={5}>

                    <ArgonBox component="form" role="form" onSubmit={handleSubmit_1}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={12}>
                            <Grid item xs={6}>
                                <Item>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Código del Hospital:
                                    </Typography>
                                    <ArgonInput
                                        value={codHospital}
                                        onChange={(event) => setCodHospital(event.target.value)}
                                    /></Item>
                            </Grid>

                            <Grid item xs={6}>
                                <Item>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Nombre del Hospital:
                                    </Typography>

                                    <ArgonInput
                                        value={nombreHospital}
                                        onChange={(event) => setNombreHospital(event.target.value)}
                                    />
                                </Item>
                            </Grid>

                            {/* <Grid item xs={6}>
                                <Item>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Ubicación del Hospital:
                                    </Typography>

                                    <ArgonInput
                                        value={ubicacion}
                                        onChange={(event) => setUbicacion(event.target.value)}
                                    />
                                </Item>
                                
                            </Grid> */}

                            {/* <Grid item xs={6}>
                                <Item>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Servicio Interno:
                                    </Typography>

                                    <ArgonInput
                                        value={servintern}
                                        onChange={(event) => setServIntern(event.target.value)}
                                    />
                                </Item>
                                
                            </Grid> */}


                        </Grid>

                        <ArgonBox mb={2}>

                        </ArgonBox>
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
                                <Link to={'/hospitales'}
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
        </DashboardLayout>
    );
};

export default Form;
