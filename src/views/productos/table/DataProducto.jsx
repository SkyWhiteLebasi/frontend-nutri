export const ProductosColumns = [
    // { field: 'id', headerName: 'ID', flex: 0.5},
    {
        field: 'codigo_id',
        headerName: 'CODIGO',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        flex: 1.5,
        width: 270,
        valueGetter: (params) =>
            `${params.row.catalogo?.cod_producto || ''}`,
    },
    {
        field: 'catalogo_id',
        headerName: 'PRODUCTO',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        flex: 3,
        width: 270,
        valueGetter: (params) =>
            `${params.row.catalogo?.nombre_producto || ''}`,
    },
 
    {
        field: 'medida_id',
        headerName: 'MEDIDA',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        flex: 1,
        width: 270,
        valueGetter: (params) =>
            `${params.row.catalogo?.medida_producto || ''}`,
    },
    { field: 'stock_producto', headerName: 'STOCK',flex: 1 },
    // { field: 'stock_inicial', headerName: 'Stock Inicial', flex: 1 },
    // { field: 'fecha_ven_producto', headerName: 'FECHA VENCIMIENTO', flex: 1.5, editable: true},
    // { field: 'obs_producto', headerName: 'DETALLE', flex: 1, editable: true},
   

];

