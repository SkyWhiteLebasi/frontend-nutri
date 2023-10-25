
import React from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Form from './Form';

const FormEntrada = () => {

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Form/>
    </DashboardLayout>
  );
};

export default FormEntrada;
