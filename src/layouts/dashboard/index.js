/* eslint-disable no-unused-vars */
/**
=========================================================
* Argon Dashboard 2 MUI - v3.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
// image preview
// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import React, { useState, useEffect } from "react";

import axios from "axios";
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DetailedStatisticsCard from "examples/Cards/StatisticsCards/DetailedStatisticsCard";
import SalesTable from "examples/Tables/SalesTable";
import CategoriesList from "examples/Lists/CategoriesList";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Argon Dashboard 2 MUI base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import Slider from "layouts/dashboard/components/Slider";

// Data
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import salesTableData from "layouts/dashboard/data/salesTableData";
import categoriesListData from "layouts/dashboard/data/categoriesListData";
import { Api_URL } from "config/Api_URL";
function Default() {
  const { size } = typography;
  const [totalProductos, setTotalProductos] = useState('');
  const [totalEntradas, setTotalActividades] = useState('');
  const [totalInsumos, setTotalInsumos] = useState('');//to.._p.._normal
  const [totalPersonal, setTotalPersonal] = useState('');//total_pedidos_dietas
  const [dashboardData, setDashboardData] = useState([]);

  const getDashboardData = async () => {
    const response = await axios.get(Api_URL + "dashboard");
    const data = response.data;

    const totalProductos = data.total_productos[0].total_productos;
    const totalEntradas = data.total_entradas[0].total_pedidos;
    const totalInsumos = data.cant_insumos[0].total_preparaciones_normales_atendidos;
    const totalPersonal = data.cant_personal[0].total_preparaciones_dietas_atendidos;
  
    setDashboardData(data);
    setTotalProductos(totalProductos);
    setTotalActividades(totalEntradas);
    setTotalInsumos(totalInsumos);
    setTotalPersonal(totalPersonal);
  };


 // console.log(Dashboard);
  useEffect(() => {
    getDashboardData();
  }, []);
  return (  
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="N° Productos"
              count={totalProductos}
              icon={{ color: "info", component: <i className="ni ni-money-coins" /> }}
              percentage={{ color: "success", count: "+55%", text: "desde ayer" }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="N° Recetas"
              count={totalEntradas}
              icon={{ color: "error", component: <i className="ni ni-world" /> }}
              percentage={{ color: "success", count: "+3%", text: "desde ayer" }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="N° Formulas"
              count={totalInsumos}
              icon={{ color: "success", component: <i className="ni ni-paper-diploma" /> }}
              percentage={{ color: "error", count: "-2%", text: "desde ayer" }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="N° Hospitales"
              count={totalPersonal}
              icon={{ color: "warning", component: <i className="ni ni-cart" /> }}
              percentage={{ color: "success", count: "+5%", text: "desde ayer" }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} lg={7}>
            <GradientLineChart
              title="Reporte (Por definir)"
              description={
                <ArgonBox display="flex" alignItems="center">
                  <ArgonBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                    <Icon sx={{ fontWeight: "bold" }}>arrow_upward</Icon>
                  </ArgonBox>
                  <ArgonTypography variant="button" color="text" fontWeight="medium">
                    4% más{" "}
                    <ArgonTypography variant="button" color="text" fontWeight="regular">
                      en 2023
                    </ArgonTypography>
                  </ArgonTypography>
                </ArgonBox>
              }
              chart={gradientLineChartData}
            />
          </Grid>
          <Grid item xs={12} lg={5}>
            <Slider />
          </Grid>
        </Grid>
        {/* <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <SalesTable title="Sales by Country" rows={salesTableData} />
          </Grid>
          <Grid item xs={12} md={4}>
            <CategoriesList title="categories" categories={categoriesListData} />
          </Grid>
        </Grid> */}
      </ArgonBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Default;
