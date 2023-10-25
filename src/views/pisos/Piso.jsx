
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ArgonBox from "components/ArgonBox";
import Card from "@mui/material/Card";
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
// import IconButton from '@mui/material';
import TablePiso from "./table/TablePiso"
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { Divider } from '@mui/material';

function Piso() {

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card className="" id="">
                        <CardHeader
                            title="Lista de Pisos"
                            subheader="Aquí se tiene la lista de Pisos"
                            action={
                                <div>
                                    {sessionStorage.getItem("auth_permisos")?.includes("pisos.store") ? (

                                        <Button variant="outlined" startIcon={<AddBoxIcon style={{ color: '#49bfd9', size: "large" }} />} size="large" style={{ fontSize: '16px', color: '#49bfd9' }}>
                                            <Link to={'/pisos/form'} style={{ color: '#49bfd9' }}>
                                                Crear
                                            </Link>
                                        </Button>
                                    ) : null}
                                    {/* <Button
                                    variant="outlined"
                                    startIcon={<InsertDriveFileIcon style={{ color: 'green' }} />}
                                    size="large"
                                    style={{ fontSize: '16px', color: 'green' }}
                                >
                                    <Link to={'/pisos/form-excel'} style={{ color: 'green' }}>
                                        Importar Excel
                                    </Link>
                                </Button> */}

                                </div>

                            }
                        />
                        <Divider sx={{ my: -1, backgroundColor: 'gray', height: 4 }} />
                        <CardContent>
                            <TablePiso />
                        </CardContent>
                    </Card>
                </ArgonBox>
            </ArgonBox>
        </DashboardLayout>

    )
}

export default Piso;