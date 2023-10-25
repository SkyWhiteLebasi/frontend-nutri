
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
import TableTipoAseg from "./table/TableTipoAseg";

function TipoAseg() {

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card className="" id="">
                        <CardHeader
                            title="Lista de Tipos de Asegurados"
                            subheader="Aquí se encuentra la lista de Tipos de Asegurados registrados"
                            action={
                                <div>
                                    {sessionStorage.getItem("auth_permisos")?.includes("tipo_asegs.store") ? (

                                        <Button variant="outlined" startIcon={<AddBoxIcon style={{ color: '#49bfd9', size: "large" }} />} size="large" style={{ fontSize: '16px', color: '#49bfd9' }}>
                                            <Link to={'/tipo_asegs/form'} style={{ color: '#49bfd9' }}>
                                                Crear
                                            </Link>
                                        </Button>
                                    ) : null}
                                    {sessionStorage.getItem("auth_permisos")?.includes("tipo_asegs.store") ? (

                                        <Button
                                            variant="outlined"
                                            startIcon={<InsertDriveFileIcon style={{ color: 'green' }} />}
                                            size="large"
                                            style={{ fontSize: '16px', color: 'green' }}
                                        >
                                            <Link to={'/tipo_asegs/form-excel'} style={{ color: 'green' }}>
                                                Importar Excel
                                            </Link>
                                        </Button>
                                    ) : null}
                                </div>
                            }
                        />
                        <Divider sx={{ my: -1, backgroundColor: 'gray', height: 4 }} />
                        <CardContent>

                            <TableTipoAseg />
                        </CardContent>
                    </Card>
                </ArgonBox>
            </ArgonBox>
        </DashboardLayout>

    )
}

export default TipoAseg;