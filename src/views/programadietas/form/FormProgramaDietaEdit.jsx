
import React from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
// import Formv2 from './Formv2';
import FormEdit from './FormEdit';
const FormProgramaDietaEdit = () => {

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* <Formv2/> */}
      <FormEdit/>
    </DashboardLayout>
  );
};

export default FormProgramaDietaEdit;
