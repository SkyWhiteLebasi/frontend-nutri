import React, { useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ArgonBox from "components/ArgonBox";
import Card from "@mui/material/Card";
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
// import IconButton from '@mui/material';
import TablePedidoDietaPisoProduccion from "./table/TablePedidoDietaPisoProduccion"
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';

import { Divider } from '@mui/material';

function PedidoDietaPisoProduccion() {

    const [searchTerm, setSearchTerm] = useState(''); 
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card className="" id="">
                        <CardHeader
                            title="Lista de Pedidos según el pisos generado por N. C."
                            subheader="Aquí se tiene la lista de pedidos para regímenes dieteticos"
                            // action={
                            //     <div>
                            //     <Button variant="outlined" startIcon={<AddBoxIcon style={{ color: '#49bfd9', size: "large" }} />} size="large" style={{ fontSize: '16px', color: '#49bfd9' }}>
                            //         <Link to={'/pedidodpisos/form'} style={{ color: '#49bfd9' }}>
                            //             Crear
                            //         </Link>
                            //     </Button>
                              

                            // </div>
                        
                            // }
                        />
                        <Divider sx={{ my: -1, backgroundColor: 'gray', height: 4}} />
                        {/* <CardContent>
                            <TablePedidoDietaPisoProduccion />
                        </CardContent> */}
                        <CardContent>
                            <h5  style={{ color: '#277ed4' }}>Escriba aquí para buscar</h5>
                            {/* Pasa searchTerm y setSearchTerm como props */}
                            <TablePedidoDietaPisoProduccion searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        </CardContent>
                    </Card>
                </ArgonBox>
            </ArgonBox>
        </DashboardLayout>

    )
}

export default PedidoDietaPisoProduccion;