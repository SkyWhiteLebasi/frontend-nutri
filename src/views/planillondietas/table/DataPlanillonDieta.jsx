export const PlanillonColums = [

    // { field: 'id', headerName: 'ID', flex:0.5 },
    {
        field: 'programadieta_id',
        headerName: 'PROGRAMA',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        flex:1,
        valueGetter: (params) =>
            `${params.row.programadieta?.nro_semana || ''}`,
    }, 
    { field: 'fecha_planillon', headerName: 'FECHA', flex:1 },
    {
        field: 'alimento_id',
        headerName: 'TIPO',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        flex:2,
        valueGetter: (params) =>
            `${params.row.alimento?.nombre_alimento || ''}`,
    }, 
  
    // { field: 'regimen_planillon', headerName: 'DETALLE', flex:2.5 },

];