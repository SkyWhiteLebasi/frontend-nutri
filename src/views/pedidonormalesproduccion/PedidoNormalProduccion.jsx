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
import TablePedidoNormalProduccion from "./table/TablePedidoNormalProduccion";

function PedidoNormalProduccion() {
    const [searchTerm, setSearchTerm] = useState(''); 
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card className="" id="">
                        <CardHeader
                            title="Lista de Pedidos Normales generado por Nutricionista-Clinico"
                            subheader="Aquí se encuentra los pedidos de regimen normal que esperan ser confirmados"
                            // action={
                            //     <div>
                            //         <Button variant="outlined" startIcon={<AddBoxIcon style={{ color: '#49bfd9', size: "large" }} />} size="large" style={{ fontSize: '16px', color: '#49bfd9' }}>
                            //             <Link to={'/pedidonormalesproduccion/form'} style={{ color: '#49bfd9' }}>
                            //                 Crear
                            //             </Link>
                            //         </Button>
                                   

                            //     </div>
                            // }
                        />
                        <Divider sx={{ my: -1, backgroundColor: 'gray', height: 4 }} />
                        {/* <CardContent>

                            <TablePedidoNormalProduccion />
                        </CardContent> */}

                        <CardContent>
                            <h5 style={{ color: '#277ed4' }}>Escriba aquí para buscar</h5>
                            {/* Pasa searchTerm y setSearchTerm como props */}
                            <TablePedidoNormalProduccion searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        </CardContent>
                    </Card>
                </ArgonBox>
            </ArgonBox>
        </DashboardLayout>

    )
}

export default PedidoNormalProduccion;