
import React, { useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import Card from "@mui/material/Card";
import { Link } from "react-router-dom";
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { Divider } from '@mui/material';
import TableCatalogo from "./table/TableCatalogo";

function Catalogo() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card className="" id="">
                        <CardHeader
                            title="Lista de Catalogos"
                            subheader="Aquí se encuentra el catalogo de los insumos"
                            action={
                                <div>
                                    {sessionStorage.getItem("auth_permisos")?.includes("catalogos.store") ? (
                                        <Button variant="outlined" startIcon={<AddBoxIcon style={{ color: '#49bfd9', size: "large" }} />} size="large" style={{ fontSize: '16px', color: '#49bfd9' }}>
                                            <Link to={'/catalogos/form'} style={{ color: '#49bfd9' }}>
                                                Crear
                                            </Link>
                                        </Button>) : null}
                                    {sessionStorage.getItem("auth_permisos")?.includes("catalogos.store") ? (

                                        <Button
                                            variant="outlined"
                                            startIcon={<InsertDriveFileIcon style={{ color: 'green' }} />}
                                            size="large"
                                            style={{ fontSize: '16px', color: 'green' }}
                                        >
                                            <Link to={'/catalogos/form-excel'} style={{ color: 'green' }}>
                                                Importar Excel
                                            </Link>
                                        </Button>
                                    ) : null}
                                </div>
                            }
                        />
                        {/* <Divider sx={{ my: -1, backgroundColor: 'gray', height: 4 }} />
                        <CardContent>
                            <TableCatalogo />
                        </CardContent> */}
                        <Divider sx={{ my: -1, backgroundColor: 'gray', height: 4 }} />
                        <CardContent>
                            <h5 style={{ color: '#277ed4' }}>Escriba aquí para buscar</h5>
                            {/* Pasa searchTerm y setSearchTerm como props */}
                            <TableCatalogo searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        </CardContent>
                    </Card>
                </ArgonBox>
            </ArgonBox>
        </DashboardLayout>
    )
}

export default Catalogo;
