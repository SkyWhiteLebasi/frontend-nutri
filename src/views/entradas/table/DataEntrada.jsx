
export const EntradasColumns = [
    { field: 'id', headerName: 'ID',  flex: 0.5,},
    
    {
        field: 'producto_id',
        headerName: 'PRODUCTO',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        flex: 2,
        width: 270,
        valueGetter: (params) =>
            `${params.row.producto?.catalogo?.nombre_producto || ''}`,
    },
    { field: 'fecha_entrada', headerName: 'FECHA DE INGRESO', flex: 1, },
    { field: 'cant_entrada', headerName: 'CANTIDAD DE INGRESO',   flex: 0.5, },
    // { field: 'obs_entrada', headerName: 'Observacion', flex: 120, editable: true},
   

];




