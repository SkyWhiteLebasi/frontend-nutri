import { useState, useEffect } from "react";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";

// Argon Dashboard 2 MUI example components
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Argon Dashboard 2 MUI base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/images/desconocido.jpg";
import { Api_URL } from "config/Api_URL";
function Header() {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    apel_paterno: "",
    apel_materno: "",
    email: "",
    password: "",
    error_list: [],
  });

  useEffect(() => {
    axios
    .get(Api_URL + "perfilUsuario")
    .then((response) => {
      const userData = response.data;
      // Llenar los campos del formulario con los datos del usuario
      setFormData({
        nombre: userData.nombre,
        apel_paterno: userData.apellido_paterno,
        apel_materno: userData.apellido_materno,
        email: userData.email,
        password: "", // Dejar este campo en blanco por razones de seguridad
      });
    })
    .catch((error) => {
      console.error("Error al obtener los datos del perfil:", error);
    });
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
    
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  return (
    <ArgonBox position="relative">
      <DashboardNavbar absolute light />
      <ArgonBox height="220px" />
      <Card
        sx={{
          py: 2,
          px: 2,
          boxShadow: ({ boxShadows: { md } }) => md,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <ArgonAvatar
              src={burceMars}
              alt="profile-image"
              variant="rounded"
              size="xl"
              shadow="sm"
            />
          </Grid>
          <Grid item>
            <ArgonBox height="100%" mt={0.5} lineHeight={1}>
              <ArgonTypography variant="h5" fontWeight="medium">
              {formData.nombre}
              </ArgonTypography>
              <ArgonTypography variant="button" color="text" fontWeight="medium">
              {formData.apel_paterno} / {formData.apel_materno}
              </ArgonTypography>
            </ArgonBox>
          </Grid>
          {/* <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="App"
                  icon={
                    <i className="ni ni-app" style={{ marginTop: "6px", marginRight: "8px" }} />
                  }
                />
                <Tab
                  label="Message"
                  icon={
                    <i
                      className="ni ni-email-83"
                      style={{ marginTop: "6px", marginRight: "8px" }}
                    />
                  }
                />
                <Tab
                  label="Settings"
                  icon={
                    <i
                      className="ni ni-settings-gear-65"
                      style={{ marginTop: "6px", marginRight: "8px" }}
                    />
                  }
                />
              </Tabs>
            </AppBar>
          </Grid> */}
        </Grid>
      </Card>
    </ArgonBox>
  );
}

export default Header;
