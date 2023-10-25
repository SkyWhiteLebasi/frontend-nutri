
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
import TableEntrada from "./table/TableEntrada";

function Entrada() {

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card className="" id="">
                        <CardHeader
                            title="Lista de Entradas"
                            subheader="Aquí se encuentra el registro de Entradas"
                            action={
                                <div>
                                    {sessionStorage.getItem("auth_permisos")?.includes("entradas.store") ? (

                                        <Button variant="outlined" startIcon={<AddBoxIcon style={{ color: '#49bfd9', size: "large" }} />} size="large" style={{ fontSize: '16px' }} color="primary">
                                            <Link to={'/entradas/form'} style={{ color: '#49bfd9' }}>
                                                Crear
                                            </Link>
                                        </Button>
                                    ) : null}
                                </div>
                            }
                        />
                        <Divider sx={{ my: -1, backgroundColor: 'gray', height: 4 }} />
                        <CardContent>

                            <TableEntrada />
                        </CardContent>
                    </Card>
                </ArgonBox>
            </ArgonBox>
        </DashboardLayout>

    )
}

export default Entrada;