
import React, { useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ArgonBox from "components/ArgonBox";
import Card from "@mui/material/Card";
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
// import IconButton from '@mui/material';
import TableProgramacion from "./table/TableProgramacion"
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';

import { Divider } from '@mui/material';
import { Add } from '@mui/icons-material';
function Programacion() {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card className="" id="">
                        <CardHeader
                            title="Lista de Programaciones de las semanas"
                            subheader="Aquí se tiene la lista de Programaciones"
                            action={
                                <div>
                                    {sessionStorage.getItem("auth_permisos")?.includes("programaciones.store") ? (

                                        <Button variant="outlined" startIcon={<AddBoxIcon style={{ color: '#49bfd9', size: "large" }} />} size="large" style={{ fontSize: '16px' }} color="primary">
                                            <Link to={'/programaciones/form'} style={{ color: '#49bfd9' }}>
                                                Crear
                                            </Link>
                                        </Button>
                                    ) : null}
                                </div>
                            }
                        />
                        <Divider sx={{ my: -1, backgroundColor: 'gray', height: 4 }} />
                        {/* <CardContent>
                            <TableProgramacion />
                        </CardContent> */}
                        <CardContent>
                            <h5 style={{ color: '#277ed4' }}>Escriba aquí para buscar</h5>
                            {/* Pasa searchTerm y setSearchTerm como props */}
                            <TableProgramacion searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        </CardContent>
                    </Card>
                </ArgonBox>
            </ArgonBox>
        </DashboardLayout>

    )
}

export default Programacion;