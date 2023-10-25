export const EntradasColumns = [
    // { field: 'id', headerName: 'ID', flex: 1 },
  
    {
      field: 'formulas_id',
      headerName: 'FORMULA',
      description: 'This column has a value getter and is not sortable.',
      sortable: true,
      // flex: 3,
      width: 200,
      valueGetter: (params) =>
        `${params.row.formulas?.nombre_formula|| ''}`,
    },
    { field: 'fecha_entrada', headerName: 'FECHA ENTRADA', flex: 1},
    { field: 'cantidad_entrada', headerName: 'CANTIDAD', flex: 1 },
    { field: 'usuario', headerName: 'ENCARGADO', flex: 1 },
  
  
  ];