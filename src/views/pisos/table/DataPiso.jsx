export const PisoColumns = [
    // { field: 'id', headerName: 'ID', flex:0.5},
    { field: 'nombre_piso', headerName: 'NOMBRE DEL PISO O AREA', flex:2 },
    {
      field: 'hospital_id',
      headerName: 'HOSPITAL',
      description: 'This column has a value getter and is not sortable.',
      sortable: true,
      flex:4,
      valueGetter: (params) =>
          `${params.row.hospital?.desc_red || ''}`,
  },
  ];
  