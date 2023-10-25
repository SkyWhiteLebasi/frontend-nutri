export const ProductoSalidasColumns = [
    { field: 'id', headerName: 'ID', flex: 0.5},
    {
        field: 'producto_id',
        headerName: 'PRODUCTO',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        flex: 3,
        width: 270,
        valueGetter: (params) =>
            `${params.row.productos?.catalogo?.nombre_producto || ''}`,
    },
    { field: 'cantidad_salida', headerName: 'CANTIDAD SALIDA',flex: 1 },
    { field: 'fecha_salida', headerName: 'FECHA', flex: 1.5, editable: true},

];

