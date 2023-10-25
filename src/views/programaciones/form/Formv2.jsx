import React, { useState } from 'react';
import Card from "@mui/material/Card";
import CardHeader from '@mui/material/CardHeader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
import { Button } from '@mui/material';
import { Divider } from '@mui/material';

import ArgonInput from "components/ArgonInput";

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

import { Api_URL } from "config/Api_URL";
const URI = "programaciones/";

const Formv2 = () => {
    const navigate = useNavigate();

    const [programaciones, setProgramaciones] = useState([{ fecha_programacion: '',  pro_desayuno: '', pro_comida: '' },{ fecha_programacion: '',  pro_desayuno: '', pro_comida: '' },{ fecha_programacion: '',  pro_desayuno: '', pro_comida: '' }]);


    const handleSubmit = async (event) => {
        try {
            event.preventDefault();

            for (let i = 0; i < programaciones.length; i++) {
                const response = await axios.post(URI, {
                    // nro_semana: programaciones[i].nro_semana,
                    fecha_programacion: programaciones[i].fecha_programacion,
                    pro_desayuno: programaciones[i].pro_desayuno,
                  
                    pro_comida: programaciones[i].pro_comida,
                });


            }

            navigate('/programaciones');

        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (index, fieldName, value) => {
        const updatedProgramaciones = [...programaciones];
        updatedProgramaciones[index] = {
            ...updatedProgramaciones[index],
            [fieldName]: value
        };
        setProgramaciones(updatedProgramaciones);
    };


    const handleAddCampo = () => {
        setProgramaciones([...programaciones, {  fecha_programacion: '',  pro_desayuno: '', pro_comida: '' }]);
    };

    const CustomButton = styled(Button)(({ theme }) => ({
        '&:hover': {
            backgroundColor: 'green',
        },
    }));

    return (
        <div style={{ justifyContent: 'center' }}>
            <Card variant="outlined">
                <div>
                    <CardHeader
                        title="REGISTRAR ProgramacioneS"
                    />
                </div>
                <Divider sx={{ my: -1.5, backgroundColor: 'lightdark', height: 4 }} />
                <div>
                    <form onSubmit={handleSubmit}>
                        {programaciones.map((programacion, index) => (
                            <div key={index}>
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <Item>
                                            <Item>
                                                Fecha de Programacion:
                                                <ArgonInput
                                                    type="date"
                                                    value={programacion.fecha_programacion}
                                                    onChange={(event) => handleInputChange(index, 'fecha_programacion', event.target.value)}
                                                />
                                            </Item>
                                        </Item>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Item>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                Desayuno {index + 1}:
                                            </Typography>
                                            <ArgonInput
                                                // required
                                                value={programacion.pro_desayuno}
                                                onChange={(event) => handleInputChange(index, 'pro_desayuno', event.target.value)}
                                            /></Item>
                                    </Grid>
                                   
                                    <Grid item xs={4}>
                                        <Item>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                Comida {index + 1}:
                                            </Typography>
                                            <ArgonInput
                                                // required
                                                value={programacion.pro_comida}
                                                onChange={(event) => handleInputChange(index, 'pro_comida', event.target.value)}
                                            />
                                        </Item>
                                    </Grid>

                        


                                </Grid>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, marginBottom: 10 }}>
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
                                fullWidth
                            >
                                Guardar
                            </CustomButton>
                            <CustomButton
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
                                fullWidth
                            >
                                <Link to={'/programaciones'} style={{ color: 'white' }}>
                                    Cancelar
                                </Link>
                            </CustomButton>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <Typography variant="button" color="text" fontWeight="regular">
                                <i>*Revise los datos antes de guardar</i>
                            </Typography>
                        </div>
                    </form>
                </div>

            </Card>
        </div>
    );
};

export default Formv2;
