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
import TableFormulaReporte from "./table/TableFormulaReporte";

function FormulaReporte() {
    const [searchTerm, setSearchTerm] = useState(''); 
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card className="" id="">
                        <CardHeader
                            title="Kardex de Formulas"
                            subheader="Aquí se encuentra el kardex de los Formulas"
                            action={
                                <div>
                                    {/* <Button variant="outlined" startIcon={<AddBoxIcon style={{ color: '#49bfd9', size: "large" }} />} size="large" style={{ fontSize: '16px', color: '#49bfd9' }}>
                                        <Link to={'/formulareportes/entradareporte'} style={{ color: '#49bfd9' }}>
                                            Entradas de Hoy
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<InsertDriveFileIcon style={{ color: 'green' }} />}
                                        size="large"
                                        style={{ fontSize: '16px', color: 'green' }}
                                    >
                                        <Link to={'/formulareportes/salidareporte'} style={{ color: 'green' }}>
                                            salidas de hoy
                                        </Link>
                                    </Button> */}

                                </div>
                            }
                        />
                        <Divider sx={{ my: -1, backgroundColor: 'gray', height: 4 }} />
                        {/* <CardContent>

                            <TableFormulaReporte />
                        </CardContent> */}
                        <CardContent>
                            <h5  style={{ color: '#277ed4' }}>Escriba aquí para buscar</h5>
                            {/* Pasa searchTerm y setSearchTerm como props */}
                            <TableFormulaReporte searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        </CardContent>
                    </Card>
                </ArgonBox>
            </ArgonBox>
        </DashboardLayout>

    )
}

export default FormulaReporte;