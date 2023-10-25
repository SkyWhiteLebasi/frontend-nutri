// Argon Dashboard 2 MUI layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import VirtualReality from "layouts/virtual-reality";
import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

import Hospital from "views/hospitales/Hospital";
import FormHospital from "views/hospitales/form/FormHospital";
import FormHospitalEdit from "views/hospitales/form/FormEdit";
import FormHospitalExcel from "views/hospitales/form/FormExcel";

import Servicio from "views/servicios/Servicio";
import FormServicio from "views/servicios/form/FormServicio";
import FormServicioExcel from "views/servicios/form/FormExcel";

import Estacion from "views/estaciones/Estacion";
import FormEstacion from "views/estaciones/form/FormEstacion";
import FormEstacionExcel from "views/estaciones/form/FormExcel";

import Paciente from "views/pacientes/Paciente";
import FormPaciente from "views/pacientes/form/FormPaciente";
import FormPacienteExcel from "views/pacientes/form/FormExcel";

import TipoAseg from "views/tipo_asegs/TipoAseg";
import FormTipoAseg from "views/tipo_asegs/form/FormTipoAseg";
import FormTipoAsegExcel from "views/tipo_asegs/form/FormExcel";

import Catalogo from "views/catalogos/Catalogo";
import FormCatalogo from "views/catalogos/form/FormCatalogo";
import FormCatalogoExcel from "views/catalogos/form/FormExcel";

import Producto from "views/productos/Producto";
import FormProducto from "views/productos/form/FormProducto";
import FormProductoExcel from "views/productos/form/FormExcel";

import Entrada from "views/entradas/Entrada";
import FormEntrada from "views/entradas/form/FormEntrada";

import Alimento from "views/alimentos/Alimento";
import FormAlimento from "views/alimentos/form/FormAlimento";

import Programacion from "views/programaciones/Programacion";
import FormProgramacion from "views/programaciones/form/FormProgramacion";
import FormProgramacionEdit from "views/programaciones/form/FormProgramacionEdit";

import ProgramaDieta from "views/programadietas/ProgramaDieta";
import FormProgramaDieta from "views/programadietas/form/FormProgramaDieta";

import PlanillonDieta from "views/planillondietas/PlanillonDieta";
import FormPlanillonDieta from "views/planillondietas/form/FormPlanillonDieta";

import PlanillonNormal from "views/planillones/Planillon";
import FormPlanillon from "views/planillones/form/FormPlanillon";

import Preparacion from "views/preparaciones/Preparacion";
import FormPreparacion from "views/preparaciones/form/FormPreparacion";
import FormPreparacionExcel from "views/preparaciones/form/FormExcel";
import FormPreparacionExcelDosifica from "views/preparaciones/form/FormExcelDosi";

import PedidoNormal from "views/pedidonormales/PedidoNormal";
import FormPedidoNormal from "views/pedidonormales/form/FormPedidoNormal";

import PedidoDieta from "views/pedidodietas/PedidoDieta";
import FormPedidoDieta from "views/pedidodietas/form/FormPedidoDieta";

import PedidoNormalProduccion from "views/pedidonormalesproduccion/PedidoNormalProduccion";
import FormPedidoNormalProduccion from "views/pedidonormalesproduccion/form/FormPedidoNormalProduccion";

import PedidoDietaProduccion from "views/pedidodietasproduccion/PedidoDietaProduccion";
import FormPedidoDietaProduccion from "views/pedidodietasproduccion/form/FormPedidoDietaProduccion";

import Dosifica from "views/nordosifica/Dosifica";
import FormDosifica from "views/nordosifica/form/FormDosifica";

import ProductoSalida from "views/productosalidas/ProductoSalida";
import FormProductoSalida from "views/productosalidas/form/FormProductoSalida";

import Formula from "views/formulas/Formula";
import FormFormula from "views/formulas/form/FormFormula";

import EntradaFormula from "views/entradaformulas/EntradaFormula";
import FormEntradaFormula from "views/entradaformulas/form/FormEntradaFormula";

import SalidaFormula from "views/salidaformulas/SalidaFormula";
import FormSalidaFormula from "views/salidaformulas/form/FormSalidaFormula";

import ProductoReporte from "views/productoreportes/ProductoReporte";
import ProductoEntradaReporte from "views/productoreportes/ProductoEntradaReporte";
import ProductoSalidaReporte from "views/productoreportes/ProductoSalidaReporte";

import FormulaReporte from "views/formulareportes/FormulaReporte";

import Piso from "views/pisos/Piso";
import FormPiso from "views/pisos/form/FormPiso";

import PedidoDietaPiso from "views/pedidodpisos/PedidoDietaPiso";
import FormPedidoDietaPiso from "views/pedidodpisos/form/FormPedidoDietaPiso";
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";

import Logins from "views/auths/login/Logins";
import Register from "views/auths/register/Register";
import FormUser from "views/users/form/FormUser";
import Users from "views/users/User";

import ReporteDieta from "views/reportedietas/ReporteDieta";
import PedidoDietaPisoProduccion from "views/pedidodpisosprod/PedidoDietaPisoProduccion";
import FormPedidoDietaPisoProduccion from "views/pedidodpisosprod/form/FormPedidoDietaPisoProduccion";

import DietaDosifica from "views/diedosifica/DietaDosifica";
import FormDietaDosifica from "views/diedosifica/form/FormDietaDosifica";
import FormRole from "views/users/form/FormRole";

const routes = [
  sessionStorage.getItem("auth_token","auth_permisos")?.includes("dashboard.index")
    ? {
      //type: "route",
      name: "Dashboard",
      key: "dashboard",
      route: "/",
    }
    : {
      //type: "route",
      name: "Login",
      key: "login",
      route: "/login",
      //icon: <ArgonBox component="i" color="primary" fontSize="14px" className="ni ni-tv-2" />,
      component: <Logins />,
    },
  sessionStorage.getItem("auth_token","auth_permisos")?.includes("dashboard.index")
    ? {
      //type: "route",
      name: "Dashboard",
      key: "dashboard",
      route: "/",
    }
    : {
      //type: "route",
      name: "Register",
      key: "register",
      route: "/register",
      //icon: <ArgonBox component="i" color="primary" fontSize="14px" className="ni ni-tv-2" />,
      component: <Register />,
    },
  {
    type: "route",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-tv-2" />,
    component: <Dashboard />,
  },

  sessionStorage.getItem("auth_permisos")?.includes("users.index")
    ? {
      type: "route",
      name: "Usuarios",
      key: "Usuarios",
      route: "/Usuarios",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-single-02" />,
      component: <Users />,
      collapse: [
        {
          type: "route",
          name: "Usuarios",
          key: "Usuarios",
          route: "/Usuarios",
          icon: (
            <ArgonBox component="i" color="dark" fontSize="14px" className="ni ni-single-02" />
          ),
          component: <Users />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("users.store")
          ? {
            type: "route",
            name: "Form",
            key: "form",
            route: "/Usuarios/form",
            icon: (
              <ArgonBox
                component="i"
                color="info"
                fontSize="14px"
                className="ni ni-calendar-grid-58"
              />
            ),
            component: <FormUser />,
          }
          : {},
        sessionStorage.getItem("auth_permisos")?.includes("users.update")
          ? {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/Usuarios/form/:id",
            icon: (
              <ArgonBox
                component="i"
                color="info"
                fontSize="14px"
                className="ni ni-calendar-grid-58"
              />
            ),
            component: <FormUser />,
          }
          : {},
        {
          type: "route",
          name: "Form_role",
          key: "form_role",
          route: "/Usuarios/roles/:id",
          icon: (
            <ArgonBox
              component="i"
              color="info"
              fontSize="14px"
              className="ni ni-calendar-grid-58"
            />
          ),
          component: <FormRole />,
        }
      ],
    }
    : {},
  {
    type: "route",
    name: "Mi Perfil",
    key: "perfil",
    route: "/perfil",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-satisfied" />,
    component: <Profile />,
  },

  { type: "title", title: "Datos de Hospital y Pacientes", key: "account-pages-1" },

  sessionStorage.getItem("auth_permisos")?.includes("hospitales.index")
    ?
    {
      type: "route",
      name: "Hospital",
      key: "hospitales",
      route: "/hospitales",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-building" />,
      component: <Hospital />,
      collapse: [
        {
          type: "route",
          name: "Hospital",
          key: "hospitales",
          route: "/hospitales",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-building" />
          ),
          component: <Hospital />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("hospitales.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/hospitales/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-building" />
            ),
            component: <FormHospital />,
          } : {},

        sessionStorage.getItem("auth_permisos")?.includes("hospitales.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/hospitales/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormHospitalEdit />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("hospitales.store")
          ?
          {
            type: "route",
            name: "Form-excel",
            key: "form",
            route: "/hospitales/form-excel",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormHospitalExcel />,
          } : {},
      ],

    } : {},

  sessionStorage.getItem("auth_permisos")?.includes("servicios.index")
    ?
    {
      type: "route",
      name: "Servicio",
      key: "servicios",
      route: "/servicios",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-map-big" />,
      component: <Servicio />,
      collapse: [
        {
          type: "route",
          name: "Servicio",
          key: "servicios",
          route: "/servicios",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-map-big" />
          ),
          component: <Servicio />,
        },

        sessionStorage.getItem("auth_permisos")?.includes("servicios.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/servicios/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormServicio />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("servicios.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/servicios/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormServicio />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("servicios.store")
          ?
          {
            type: "route",
            name: "Form-excel",
            key: "form",
            route: "/servicios/form-excel",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormServicioExcel />,
          } : {},
      ],

    } : {},
  sessionStorage.getItem("auth_permisos")?.includes("estaciones.index")
    ?
    {
      type: "route",
      name: "Estacion",
      key: "estaciones",
      route: "/estaciones",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-ungroup" />,
      component: <Estacion />,
      collapse: [
        {
          type: "route",
          name: "Estacion",
          key: "estaciones",
          route: "/estaciones",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-ungroup" />
          ),
          component: <Estacion />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("estaciones.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/estaciones/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormEstacion />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("estaciones.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/estaciones/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormEstacion />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("estaciones.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/estaciones/form-excel",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormEstacionExcel />,
          } : {},
      ],

    } : {},
  sessionStorage.getItem("auth_permisos")?.includes("pisos.index")
    ?
    {
      type: "route",
      name: "Piso o Area de Hospital",
      key: "pisos",
      route: "/pisos",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-pin-3 " />,
      component: <Piso />,
      collapse: [
        {
          type: "route",
          name: "Piso o Area de Hospital",
          key: "pisos",
          route: "/pisos",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
          ),
          component: <Piso />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("pisos.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/pisos/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPiso />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("pisos.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "pisos",
            route: "/pisos/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPiso />,
          } : {},
      ],

    } : {},
  sessionStorage.getItem("auth_permisos")?.includes("pacientes.index")
    ?
    {
      type: "route",
      name: "Paciente",
      key: "pacientes",
      route: "/pacientes",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-circle-08" />,
      component: <Paciente />,
      collapse: [
        {
          type: "route",
          name: "Paciente",
          key: "pacientes",
          route: "/pacientes",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-circle-08" />
          ),
          component: <Paciente />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("pacientes.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/pacientes/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPaciente />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("pacientes.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/pacientes/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPaciente />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("pacientes.store")
          ?
          {
            type: "route",
            name: "Form-excel",
            key: "form",
            route: "/pacientes/form-excel",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPacienteExcel />,
          } : {},
      ],

    } : {},

  sessionStorage.getItem("auth_permisos")?.includes("tipo_asegs.index")
    ?
    {
      type: "route",
      name: "Tipo de Asegurado",
      key: "tipo_asegs",
      route: "/tipo_asegs",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-palette" />,
      component: <TipoAseg />,
      collapse: [
        {
          type: "route",
          name: "Tipo de Asegurado",
          key: "tipo_asegs",
          route: "/tipo_asegs",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-palette" />
          ),
          component: <TipoAseg />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("tipo_asegs.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/tipo_asegs/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormTipoAseg />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("tipo_asegs.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/tipo_asegs/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormTipoAseg />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("tipo_asegs.store")
          ?
          {
            type: "route",
            name: "Form-excel",
            key: "form",
            route: "/tipo_asegs/form-excel",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormTipoAsegExcel />,
          } : {},
      ],

    } : {},
  { type: "title", title: "Catalogo, Productos, Movimientos", key: "account1" },

  sessionStorage.getItem("auth_permisos")?.includes("catalogos.index")
    ?
    {
      type: "route",
      name: "Catalogo",
      key: "catalogos",
      route: "/catalogos",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-book-bookmark" />,
      component: <Catalogo />,
      collapse: [
        {
          type: "route",
          name: "Catalogo",
          key: "catalogos",
          route: "/catalogos",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-book-bookmark" />
          ),
          component: <Catalogo />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("catalogos.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/catalogos/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormCatalogo />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("catalogos.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/catalogos/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormCatalogo />,
          } : {},

        sessionStorage.getItem("auth_permisos")?.includes("catalogos.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/catalogos/form-excel",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormCatalogoExcel />,
          } : {},
      ],

    } : {},

  sessionStorage.getItem("auth_permisos")?.includes("reportesproducto.index")
    ?
    {
      type: "route",
      name: "Kardex de Producto",
      key: "productoreportes",
      route: "/productoreportes",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-chart-bar-32" />,
      component: <ProductoReporte />,
      collapse: [
        {
          type: "route",
          name: "Kardex de Producto",
          key: "productoreportes",
          route: "/productoreportes",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-chart-bar-32" />
          ),
          component: <ProductoReporte />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("reportesproducto.index")
          ?
          {
            type: "route",
            name: "Entrada de Productos",
            key: "/productoreportes/entradareporte",
            route: "/productoreportes/entradareporte",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <ProductoEntradaReporte />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("reportesproducto.index")
          ?
          {
            type: "route",
            name: "Salida de Productos",
            key: "/productoreportes/salidareporte",
            route: "/productoreportes/salidareporte",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <ProductoSalidaReporte />,
          } : {},

      ],

    } : {},
  sessionStorage.getItem("auth_permisos")?.includes("reportesformula.index")
    ?
    {
      type: "route",
      name: "Kardex de Formulas",
      key: "formulareportes",
      route: "/formulareportes",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-chart-bar-32" />,
      component: <FormulaReporte />,
      collapse: [
        {
          type: "route",
          name: "Kardex de Formulas",
          key: "formulareportes",
          route: "/formulareportes",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-chart-bar-32" />
          ),
          component: <FormulaReporte />,
        },


      ],


    } : {},

  sessionStorage.getItem("auth_permisos")?.includes("productos.index")
    ?
    {
      type: "route",
      name: "Producto",
      key: "productos",
      route: "/productos",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-bag-17" />,
      component: <Producto />,
      collapse: [
        {
          type: "route",
          name: "Producto",
          key: "productos",
          route: "/productos",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-bag-17" />
          ),
          component: <Producto />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("productos.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/productos/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormProducto />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("productos.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/productos/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormProducto />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("productos.store")
          ?
          {
            type: "route",
            name: "Form-excel",
            key: "form",
            route: "/productos/form-excel",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormProductoExcel />,
          } : {},
      ],

    } : {},
  sessionStorage.getItem("auth_permisos")?.includes("entradas.index")
    ?
    {
      type: "route",
      name: "Entrada Producto",
      key: "entradas",
      route: "/entradas",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-bold-right" />,
      component: <Entrada />,
      collapse: [
        {
          type: "route",
          name: "Entrada Producto",
          key: "entradas",
          route: "/entradas",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-bold-right" />
          ),
          component: <Entrada />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("entradas.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/entradas/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormEntrada />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("entradas.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/entradas/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormEntrada />,
          } : {},
      ],

    } : {},

  sessionStorage.getItem("auth_permisos")?.includes("salidaproductos.index")
    ?
    {
      type: "route",
      name: "Salida Producto",
      key: "productosalidas",
      route: "/productosalidas",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-bold-left" />,
      component: <ProductoSalida />,
      collapse: [
        {
          type: "route",
          name: "Salida Producto",
          key: "productosalidas",
          route: "/productosalidas",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-bold-left" />
          ),
          component: <ProductoSalida />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("salidaproductos.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/productosalidas/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormProductoSalida />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("salidaproductos.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/productosalidas/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormProductoSalida />,
          } : {},
      ],

    } : {},
  { type: "title", title: "Nutricionista de Produccion", key: "account-pages-2" },

  sessionStorage.getItem("auth_permisos")?.includes("programaciones.index")
    ?
    {
      type: "route",
      name: "Programa Normal",
      key: "programaciones",
      route: "/programaciones",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />,
      component: <Programacion />,
      collapse: [
        {
          type: "route",
          name: "Programa Normal",
          key: "programaciones",
          route: "/programaciones",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
          ),
          component: <Programacion />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("programaciones.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/programaciones/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormProgramacion />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("programaciones.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/programaciones/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormProgramacionEdit />,
          } : {},
      ],

    } : {},

  sessionStorage.getItem("auth_permisos")?.includes("programadietas.index")
    ?
    {
      type: "route",
      name: "Programa Dieta",
      key: "programadietas",
      route: "/programadietas",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />,
      component: <ProgramaDieta />,
      collapse: [
        {
          type: "route",
          name: "Programa Dieta",
          key: "programadietas",
          route: "/programadietas",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
          ),
          component: <ProgramaDieta />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("programadietas.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/programadietas/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormProgramaDieta />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("programadietas.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/programadietas/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            // component: <FormProgramaDietaEdit/>,
          } : {},
      ],

    } : {},

  sessionStorage.getItem("auth_permisos")?.includes("planillondietas.index")
    ?
    {
      type: "route",
      name: "Planillon Dieta",
      key: "planillondietas",
      route: "/planillondietas",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-bullet-list-67" />,
      component: <PlanillonDieta />,
      collapse: [
        {
          type: "route",
          name: "Planillon Dieta",
          key: "planillondietas",
          route: "/planillondietas",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-bullet-list-67" />
          ),
          component: <PlanillonDieta />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("planillondietas.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/planillondietas/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPlanillonDieta />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("planillondietas.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/planillondietas/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPlanillonDieta />,
          } : {},
      ],

    } : {},

  // No
  sessionStorage.getItem("auth_permisos")?.includes("reporte_dietas.index")
    ?
    {
      type: "route",
      name: "Reporte Planillon Dieta",
      key: "reportedietas",
      route: "/reportedietas",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-books" />,
      component: <ReporteDieta />,
      collapse: [
        {
          type: "route",
          name: "Reporte Planillon Dieta",
          key: "reportedietas",
          route: "/reportedietas",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-books" />
          ),
          component: <ReporteDieta />,
        },
      ],

    } : {},

  sessionStorage.getItem("auth_permisos")?.includes("planillones.index")
    ?
    {
      type: "route",
      name: "Planillon Normal",
      key: "planillones",
      route: "/planillones",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-single-copy-04" />,
      component: <PlanillonNormal />,
      collapse: [
        {
          type: "route",
          name: "Planillon Normal",
          key: "planillones",
          route: "/planillones",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-single-copy-04" />
          ),
          component: <PlanillonNormal />,
        },

        sessionStorage.getItem("auth_permisos")?.includes("planillones.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/planillones/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPlanillon />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("planillones.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/planillones/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPlanillon />,
          } : {},
      ],

    } : {},

  sessionStorage.getItem("auth_permisos")?.includes("pedidosnormalesproduccion.index")
    ?
    {
      type: "route",
      name: "Pedido Normal N.P.",
      key: "pedidonormalesproduccion",
      route: "/pedidonormalesproduccion",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-folder-17" />,
      component: <PedidoNormalProduccion />,
      collapse: [
        {
          type: "route",
          name: "Pedido Normal N.P.",
          key: "pedidonormalesproduccion",
          route: "/pedidonormalesproduccion",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-folder-17" />
          ),
          component: <PedidoNormalProduccion />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("pedidosnormalesproduccion.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/pedidonormalesproduccion/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPedidoNormalProduccion />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("pedidosnormalesproduccion.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/pedidonormalesproduccion/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPedidoNormalProduccion />,
          } : {},
      ],

    } : {},

  sessionStorage.getItem("auth_permisos")?.includes("pedidodietasproduccion.index")
    ?
    {
      type: "route",
      name: "Pedido Dieta N.P.",
      key: "pedidodietasproduccion",
      route: "/pedidodietasproduccion",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-fat-delete" />,
      component: <PedidoDietaProduccion />,
      collapse: [
        {
          type: "route",
          name: "Pedido Dieta N.P.",
          key: "pedidodietasproduccion",
          route: "/pedidodietasproduccion",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-fat-delete" />
          ),
          component: <PedidoDietaProduccion />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("pedidodietasproduccion.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/pedidodietasproduccion/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPedidoDietaProduccion />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("pedidodietasproduccion.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/pedidodietasproduccion/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPedidoDietaProduccion />,
          } : {},
      ],

    } : {},

  //noooo
  sessionStorage.getItem("auth_permisos")?.includes("pedidodpisosproduccion.index")
    ?
    {
      type: "route",
      name: "Pedido X Piso  N. P.",
      key: "pedidodpisosprod",
      route: "/pedidodpisosprod",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-archive-2" />,
      component: <PedidoDietaPisoProduccion />,
      collapse: [
        {
          type: "route",
          name: "Pedido X Piso N. P.",
          key: "pedidodpisosprod",
          route: "/pedidodpisosprod",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-archive-2" />
          ),
          component: <PedidoDietaPisoProduccion />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("pedidodpisosproduccion.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/pedidodpisosprod/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPedidoDietaPisoProduccion />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("pedidodpisosproduccion.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/pedidodpisosprod/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPedidoDietaPisoProduccion />,
          } : {},


      ],

    } : {},

  { type: "title", title: "Dietas, Alimento y Dosificacion", key: "account3" },

  sessionStorage.getItem("auth_permisos")?.includes("alimentos.index")
    ?
    {
      type: "route",
      name: "Alimento",
      key: "alimentos",
      route: "/alimentos",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-tag" />,
      component: <Alimento />,
      collapse: [
        {
          type: "route",
          name: "Alimento",
          key: "alimentos",
          route: "/alimentos",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-tag" />
          ),
          component: <Alimento />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("alimentos.index")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/alimentos/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormAlimento />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("alimentos.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/alimentos/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormAlimento />,
          } : {},
      ],

    } : {},

  sessionStorage.getItem("auth_permisos")?.includes("preparaciones.index")
    ?
    {
      type: "route",
      name: "Dietas",
      key: "preparaciones",
      route: "/preparaciones",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-bell-55" />,
      component: <Preparacion />,
      collapse: [
        {
          type: "route",
          name: "Dietas",
          key: "preparaciones",
          route: "/preparaciones",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-bell-55" />
          ),
          component: <Preparacion />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("preparaciones.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/preparaciones/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPreparacion />,
          } : {},

        {
          type: "route",
          name: "Form-excel",
          key: "form",
          route: "/preparaciones/form-excel",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
          ),
          component: <FormPreparacionExcel />,
        },
        {
          type: "route",
          name: "Form-excel",
          key: "form",
          route: "/preparaciones/form-excel-dosi",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
          ),
          component: <FormPreparacionExcelDosifica />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("preparaciones.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/preparaciones/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPreparacion />,
          } : {},
      ],

    } : {},
  sessionStorage.getItem("auth_permisos")?.includes("dosificanormales.index")
    ?
    {
      type: "route",
      name: "Dosificacion Normal",
      key: "dosificanormales",
      route: "/dosificanormales",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-chart-pie-35" />,
      component: <Dosifica />,
      collapse: [
        {
          type: "route",
          name: "Dosificacion Normal",
          key: "dosificanormales",
          route: "/dosificanormales",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-chart-pie-35" />
          ),
          component: <Dosifica />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("dosificanormales.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/dosificanormales/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormDosifica />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("dosificanormales.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/dosificanormales/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormDosifica />,
          } : {},
      ],

    } : {},


  //noo
  /*mimi*/
  sessionStorage.getItem("auth_permisos")?.includes("dosificadietas.index")
    ?
    {
      type: "route",
      name: "Dosificacion Dieta",
      key: "dosificadietas",
      route: "/dosificadietas",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-chart-pie-35" />,
      component: <DietaDosifica />,
      collapse: [
        {
          type: "route",
          name: "Dosificacion Normal",
          key: "dosificadietas",
          route: "/dosificadietas",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-chart-pie-35" />
          ),
          component: <DietaDosifica />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("dosificadietas.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/dosificadietas/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormDietaDosifica />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("dosificadietas.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/dosificadietas/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormDietaDosifica />,
          } : {},
      ],

    } : {},
  { type: "title", title: "Nutricionista Clinico", key: "account4" },


  sessionStorage.getItem("auth_permisos")?.includes("pedidosnormales.index")
    ?
    {
      type: "route",
      name: "Pedido Normal N.C.",
      key: "pedidonormales",
      route: "/pedidonormales",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
      component: <PedidoNormal />,
      collapse: [
        {
          type: "route",
          name: "Pedido Normal",
          key: "pedidonormales",
          route: "/pedidonormales",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />
          ),
          component: <PedidoNormal />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("pedidosnormales.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/pedidonormales/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPedidoNormal />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("pedidosnormales.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/pedidonormales/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPedidoNormal />,
          } : {},
      ],

    } : {},

  sessionStorage.getItem("auth_permisos")?.includes("pedidodietas.index")
    ?
    {
      type: "route",
      name: "Pedido Dieta N.C.",
      key: "pedidodietas",
      route: "/pedidodietas",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-fat-delete" />,
      component: <PedidoDieta />,
      collapse: [
        {
          type: "route",
          name: "Pedido Normal",
          key: "pedidodietas",
          route: "/pedidodietas",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-fat-delete" />
          ),
          component: <PedidoDieta />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("pedidodietas.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/pedidodietas/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPedidoDieta />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("pedidodietas.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/pedidodietas/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPedidoDieta />,
          } : {},
      ],

    } : {},

  sessionStorage.getItem("auth_permisos")?.includes("pedidodpisos.index")
    ?
    {
      type: "route",
      name: "Pedido X Piso",
      key: "pedidodpisos",
      route: "/pedidodpisos",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
      component: <PedidoDietaPiso />,
      collapse: [
        {
          type: "route",
          name: "Pedido X Piso",
          key: "pedidodpisos",
          route: "/pedidodpisos",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />
          ),
          component: <PedidoDietaPiso />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("pedidodpisos.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/pedidodpisos/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPedidoDietaPiso />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("pedidodpisos.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/pedidodpisos/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormPedidoDietaPiso />,
          } : {},
      ],

    } : {},

  // {
  //   type: "route",
  //   name: "Billing",
  //   key: "billing",
  //   route: "/billing",
  //   icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-credit-card" />,
  //   component: <Billing />,
  // },
  // {
  //   type: "route",
  //   name: "Virtual Reality",
  //   key: "virtual-reality",
  //   route: "/virtual-reality",
  //   icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
  //   component: <VirtualReality />,
  // },
  // {
  //   type: "route",
  //   name: "RTL",
  //   key: "rtl",
  //   route: "/rtl",
  //   icon: <ArgonBox component="i" color="error" fontSize="14px" className="ni ni-world-2" />,
  //   component: <RTL />,
  // },
  { type: "title", title: "FORMULAS", key: "account-pages" },
  sessionStorage.getItem("auth_permisos")?.includes("formulas.index")
    ?
    {
      type: "route",
      name: "Formula",
      key: "formulas",
      route: "/formulas",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-atom" />,
      component: <Formula />,
      collapse: [
        {
          type: "route",
          name: "Formula",
          key: "formulas",
          route: "/formulas",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-atom" />
          ),
          component: <Formula />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("formulas.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/formulas/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormFormula />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("formulas.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/formulas/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormFormula />,
          } : {},
      ],

    } : {},
  sessionStorage.getItem("auth_permisos")?.includes("entrada_formulas.index")
    ?
    {
      type: "route",
      name: "Entrada Formula",
      key: "entradaformulas",
      route: "/entradaformulas",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-bold-right" />,
      component: <EntradaFormula />,
      collapse: [
        {
          type: "route",
          name: "Entrada Formula",
          key: "entradaformulas",
          route: "/entradaformulas",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-bold-right" />
          ),
          component: <EntradaFormula />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("entrada_formulas.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/entradaformulas/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormEntradaFormula />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("entrada_formulas.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/entradaformulas/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormEntradaFormula />,
          } : {},
      ],

    } : {},
  sessionStorage.getItem("auth_permisos")?.includes("salida_formulas.index")
    ?
    {
      type: "route",
      name: "Salida Formula",
      key: "salidaformulas",
      route: "/salidaformulas",
      icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-bold-left" />,
      component: <SalidaFormula />,
      collapse: [
        {
          type: "route",
          name: "Salida Formula",
          key: "salidaformulas",
          route: "/salidaformulas",
          icon: (
            <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-bold-left" />
          ),
          component: <SalidaFormula />,
        },
        sessionStorage.getItem("auth_permisos")?.includes("salida_formulas.store")
          ?
          {
            type: "route",
            name: "Form",
            key: "form",
            route: "/salidaformulas/form",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormSalidaFormula />,
          } : {},
        sessionStorage.getItem("auth_permisos")?.includes("salida_formulas.update")
          ?
          {
            type: "route",
            name: "Form_edit",
            key: "form_edit",
            route: "/salidaformulas/form/:id",
            icon: (
              <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-calendar-grid-58" />
            ),
            component: <FormSalidaFormula />,
          } : {},
      ],

    } : {},

  // {
  //   type: "route",
  //   name: "Profile",
  //   key: "profile",
  //   route: "/profile",
  //   icon: <ArgonBox component="i" color="dark" fontSize="14px" className="ni ni-single-02" />,
  //   component: <Profile />,
  // },
  // {
  //   type: "route",
  //   name: "Sign In",
  //   key: "sign-in",
  //   route: "/authentication/sign-in",
  //   icon: (
  //     <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-single-copy-04" />
  //   ),
  //   component: <SignIn />,
  // },
  // {
  //   type: "route",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   route: "/authentication/sign-up",
  //   icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
  //   component: <SignUp />,
  // },
];

export default routes;
