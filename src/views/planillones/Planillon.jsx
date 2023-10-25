"use strict";
import React, { useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ArgonBox from "components/ArgonBox";
import Card from "@mui/material/Card";

import { Link } from "react-router-dom";
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Divider } from '@mui/material';
import TablePlanillonNormal from "./table/TablePlanillon";


function PlanillonNormal() {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <Card>
                    <CardHeader
                        title="Lista de planillones de regímenes normales"
                        subheader="Aquí se muestra la lista de planillones por fecha y tipo"
                        action={
                            <div>
                                {sessionStorage.getItem("auth_permisos")?.includes("planillones.store") ? (

                                    <Button variant="outlined" startIcon={<AddBoxIcon style={{ color: '#49bfd9', size: "large" }} />} size="large" style={{ fontSize: '16px' }} color="primary">
                                        <Link to={'/planillones/form'} style={{ color: '#49bfd9' }}>
                                            Crear
                                        </Link>
                                    </Button>
                                ) : null}
                            </div>
                        } />
                    <Divider sx={{ my: -1, backgroundColor: 'gray', height: 4 }} />
                    {/* <CardContent>
                        <TablePlanillonNormal/>
                    </CardContent> */}
                    <CardContent>
                        <h5 style={{ color: '#277ed4' }}>Escriba aquí para buscar</h5>
                        {/* Pasa searchTerm y setSearchTerm como props */}
                        <TablePlanillonNormal searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    </CardContent>
                </Card>

            </ArgonBox>
        </DashboardLayout>
    )
}

export default PlanillonNormal;