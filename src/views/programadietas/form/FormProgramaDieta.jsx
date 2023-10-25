
import React from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
// import Formv2 from './Formv2';
import Form from './Form';
const FormProgramaDieta = () => {

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* <Formv2/> */}
      <Form/>
    </DashboardLayout>
  );
};

export default FormProgramaDieta;
