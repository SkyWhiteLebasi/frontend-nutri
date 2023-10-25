
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import Card from "@mui/material/Card";
import { Link } from "react-router-dom";
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { Divider } from '@mui/material';
import TableProductoEntradaReporte from "./table1/TableProductoEntradaReporte";

function ProductoEntradaReporte() {

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card className="" id="">
                        <CardHeader
                            title="Entrada de Productos Hoy"
                            subheader="Aquí se encuentra la lista de los productos que ingresaron"
                            
                        />
                        <Divider sx={{ my: -1, backgroundColor: 'gray', height: 4 }} />
                        <CardContent>

                            <TableProductoEntradaReporte />
                        </CardContent>
                    </Card>
                </ArgonBox>
            </ArgonBox>
        </DashboardLayout>

    )
}

export default ProductoEntradaReporte;