import React, { useState, useEffect } from 'react';
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
const URI = Api_URL + "hospitales/";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Form = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [hospitales, setHospitales] = useState([]);
    const [nombreHospital, setNombreHospital] = useState('');
    const [codHospital, setCodHospital] = useState('');
    // const [ubicacion, setUbicacion] = useState('');
    // const [servintern, setServintern] = useState('');

    useEffect(() => {
        if (id) {
            getHospital();
        }
    }, []);

    const getHospital = async () => {
        try {
            const response = await axios.get(`${URI}${id}`);
            setNombreHospital(response.data.desc_red);
            setCodHospital(response.data.cod_red);
            // setUbicacion(response.data.ubicacion);
            // setServintern(response.data.servintern);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit_1 = (event) => {
        event.preventDefault();
        const nuevoHospital = {
            desc_red: nombreHospital,
            cod_red: codHospital,
            // ubicacion: ubicacion,
            // servintern: servintern
        };
        setHospitales([...hospitales, nuevoHospital]);
        setNombreHospital('');
        setCodHospital('');
        // setUbicacion('');
        // setServintern('');
    };

    const handleSubmit = async () => {
        try {
            for (let i = 0; i < hospitales.length; i++) {
                const hospital = hospitales[i];
                if (id) {
                    await axios.put(`${URI}${id}`, hospital);
                } else {
                    await axios.post(URI, hospital);
                }
            }
            navigate('/hospitales');
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (index, field, value) => {
        const updatedHospitales = [...hospitales];
        updatedHospitales[index][field] = value;
        setHospitales(updatedHospitales);
    };

    const CustomButton = styled(Button)(({ theme }) => ({
        '&:hover': {
            backgroundColor: 'green',
        },
    }));

    return (
        <Card>
            <ArgonBox p={1} mb={1} textAlign="center">
                <CardHeader
                    title="REGISTRAR NUEVO HOSPITAL"
                />
            </ArgonBox>
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
                                />
                            </Item>
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
                                    onChange={(event) => setServintern(event.target.value)}
                                />
                            </Item>
                        </Grid> */}
                    </Grid>
                    <ArgonBox mb={2}></ArgonBox>
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
                                    backgroundColor: '#d25c26',
                                },
                                marginRight: '10px'
                            }}
                            onClick={handleSubmit_1}
                            fullWidth
                        >
                            Agregar Hospital
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
                                    backgroundColor: '#0a7eb4',
                                },
                            }}
                            onClick={handleSubmit}
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
                                    background: '#777777',
                                    color: 'white',
                                    width: '25%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                },
                                '&:hover': {
                                    backgroundColor: '#555555',
                                },
                            }}
                            onClick={() => navigate('/hospitales')}
                            fullWidth
                        >
                            Cancelar
                        </CustomButton>
                    </ArgonBox>
                    <ArgonBox mt={2}>
                        <ArgonTypography variant="button" color="text" fontWeight="regular">
                            <i>*Revise los datos antes de guardar&nbsp;*</i>
                        </ArgonTypography>
                    </ArgonBox>
                </ArgonBox>
                {hospitales.map((hospital, index) => (
                    <div key={index}>
                        <Divider sx={{ my: 1.5, backgroundColor: 'lightdark', height: 4 }} />
                        <ArgonBox pt={2} pb={3} px={5}>
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={12}>
                                <Grid item xs={6}>
                                    <Item>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                            Código del Hospital {index + 1}:
                                        </Typography>
                                        <ArgonInput
                                            value={hospital.cod_red}
                                            onChange={(event) => handleInputChange(index, 'cod_red', event.target.value)}
                                        />
                                    </Item>
                                </Grid>
                                <Grid item xs={6}>
                                    <Item>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                            Nombre del Hospital {index + 1}:
                                        </Typography>
                                        <ArgonInput
                                            value={hospital.desc_red}
                                            onChange={(event) => handleInputChange(index, 'desc_red', event.target.value)}
                                        />
                                    </Item>
                                </Grid>
                                {/* <Grid item xs={12}>
                                    <Item>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                            Ubicación del Hospital {index + 1}:
                                        </Typography>
                                        <ArgonInput
                                            value={hospital.ubicacion}
                                            onChange={(event) => handleInputChange(index, 'ubicacion', event.target.value)}
                                        />
                                    </Item>
                                </Grid> */}
                            </Grid>
                        </ArgonBox>
                    </div>
                ))}
            </ArgonBox>
        </Card>
    );
};

export default Form;
