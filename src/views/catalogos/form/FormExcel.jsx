import React, { useRef, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ArgonBox from "components/ArgonBox";
import Card from "@mui/material/Card";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import CardHeader from "@mui/material/CardHeader";
import { Divider } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress"; // Import LinearProgress component

import { Api_URL } from "config/Api_URL";

const URI = Api_URL + "catalogos/";

const Form = styled("form")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px",
});

const Input = styled("input")({
  display: "none",
});

const ImportButton = styled(Button)({
  marginTop: "16px",
});

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[300],
  display: "flex", // Para centrarlo horizontalmente
  alignItems: "center", // Para centrarlo verticalmente
  "& .MuiLinearProgress-bar": {
    backgroundColor: theme.palette.primary.main,
    transition: "width 1s ease-in-out",
  },
}));

const FormCatalogoExcel = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0); // Add a state for the upload progress

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0); // Agregar estado para el progreso

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setErrors({});
    setUploadProgress(0);
  };

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("import_file", selectedFile);

      for (let progress = 0; progress < 100; progress += 10) {
        setUploadProgress(progress);
        await new Promise((resolve) => setTimeout(resolve, 400)); // Simulated 1-second delay
      }

      const response = await axios.post(URI, formData);

      if (response.data.status === 202) {
        Swal.fire({
          title: "Importado con Exito..",
          // text: 'Presione Clik para cerrar!',
          icon: "success",
          timer: 5500,
        });
        navigate("/catalogos");
      } else if (response.data.status === 421) {
        const data = response.data;
        if (data.errors) {
          setErrors(data.errors);
        }
      }
      // Handle the response if needed
      console.log(response.data.message);
      navigate("/catalogos");
    } catch (error) {
      // Handle errors if necessary
      console.error(error);
    } finally {
      // Set progress to 100% when the process is completed
      setUploadProgress(100);
    }
  };

  const handleImportButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Card>
        <ArgonBox p={1} mb={1} textAlign="center">
          <CardHeader title="REGISTRAR VARIOS PRODUCTOS EN CATALOGO" />
        </ArgonBox>
        <Divider sx={{ my: -1.5, backgroundColor: "lightdark", height: 4 }} />
        <Card>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "80%", mr: 1 }}>
              {uploadProgress > 0 && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ width: "100%", mr: 1 }}>
                    <StyledLinearProgress
                      variant="determinate"
                      value={uploadProgress}
                      sx={{ width: `${uploadProgress}%` }} // Usamos "sx" para establecer el ancho
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                      uploadProgress
                    )}%`}</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </div>
        </Card>
        {selectedFile && <ImportButton>{selectedFile.name}</ImportButton>}

        <Form>
          {progress > 0 && (
            <div className="progress-bar">
              <div className="progress">{Math.min(progress, 100)}%</div>
            </div>
          )}
          <Input
            type="file"
            accept=".xls, .xlsx"
            ref={fileInputRef}
            onChange={handleFileInputChange}
          />
          <ImportButton
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={handleImportButtonClick}
          >
            Seleccionar Archivo
          </ImportButton>
          {selectedFile && (
            <ImportButton
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={handleFileUpload}
            >
              Importar Archivo
            </ImportButton>
          )}
          {errors && (
            <div className="error-messages">
              {Object.keys(errors).map((field) => (
                <p key={field} style={{ color: "#E62DE3" }}>
                  {errors[field][0]}
                </p>
              ))}
            </div>
          )}
        </Form>
      </Card>
    </DashboardLayout>
  );
};

export default FormCatalogoExcel;
