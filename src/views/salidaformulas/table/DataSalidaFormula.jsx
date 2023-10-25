export const SalidaFormulaColumns = [
    // { field: 'id', headerName: 'ID', flex: 1 },
  
    {
      field: 'formulas_id',
      headerName: 'FORMULA',
      description: 'This column has a value getter and is not sortable.',
      sortable: true,
      flex: 2,
      width: 200,
      valueGetter: (params) =>
        `${params.row.formulas?.nombre_formula || ''}`,
    },
    { field: 'usuario', headerName: 'ENCARGADO', flex: 1},
    { field: 'fecha_salida', headerName: 'FECHA  SALIDA', flex: 1},
    { field: 'cantidad_salida', headerName: 'CANTIDAD', flex: 1 },
    // { field: 'observacion_salida', headerName: 'OBSERVACION', flex: 1 },
  
  
  ];