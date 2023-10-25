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

const URI = "http://127.0.0.1:8000/api/preparaciones/";

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

const FormPreparacionExcelDosifica = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);  
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("import_file_different", selectedFile);

      // Make an API request to the Laravel backend to upload the file
      const response = await axios.post(URI, formData);
      if (response.data.status === 201) {
      }
      if (response.data.status === 421) {
        const data = response.data;
        if (data.errors) {
          setErrors(data.errors);
        }
      }
      // Handle the response if needed
      console.log(response.data.message);
      // navigate('/preparaciones')
    } catch (error) {
      // Handle errors if necessary
      console.error(error);
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
          <CardHeader title="REGISTRAR VARIAS PREPARACIONES" />
        </ArgonBox>
        <Divider sx={{ my: -1.5, backgroundColor: "lightdark", height: 4 }} />

        <Form>
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

export default FormPreparacionExcelDosifica;
