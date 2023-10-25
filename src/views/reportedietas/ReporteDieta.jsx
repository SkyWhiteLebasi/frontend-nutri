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
import { Divider } from '@mui/material';

import TableReporteDieta from "./table/TableReporteDieta"

function ReporteDieta() {
    const [searchTerm, setSearchTerm] = useState(''); 

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card className="" id="">
                        <CardHeader
                            title="Planillon X Pedido de regímen dietetico"
                            subheader="Aquí se encuentra la vista detallada por cada preparacion los pedidos de dietas"
                            // action={
                            //     <Button variant="outlined" startIcon={<AddBoxIcon style={{ color: '#49bfd9', size: "large" }} />} size="large" style={{ fontSize: '16px' }} color="primary">
                            //         <Link to={'/ReporteDietas/form'} style={{ color: '#49bfd9' }}>
                            //             Crear
                            //         </Link>
                            //     </Button>
                            // }
                        />
                        <Divider sx={{ my: -1, backgroundColor: 'gray', height: 4 }} />
                        {/* <CardContent>
                            <TableReporteDieta />
                        </CardContent> */}
                        <CardContent>
                            <h5  style={{ color: '#277ed4' }}>Escriba aquí para buscar</h5>
                            {/* Pasa searchTerm y setSearchTerm como props */}
                            <TableReporteDieta searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        </CardContent>


                    </Card>
                </ArgonBox>
            </ArgonBox>
        </DashboardLayout>

    )
}

export default ReporteDieta;