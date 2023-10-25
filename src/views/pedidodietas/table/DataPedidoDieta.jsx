export const PedidosColumns = [
    { field: 'id', headerName: 'ID', flex: 0.5},
    // {
    //     field: 'planillon_id',
    //     headerName: 'PLANILLON',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: true,
    //     // flex: 3,
    //     width: 270,
    //     valueGetter: (params) =>
    //         `${params.row.alimento?.nombre_alimento || ''}`,
    // },
    { field: 'fecha_pedido', headerName: 'FECHA PEDIDO', flex: 2 },
    { field: 'alimento', headerName: 'ALIMENTO', flex: 1.5, editable: true},
    {
        field: 'paciente_id',
        headerName: 'PACIENTE',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        // flex: 3,
        width: 270,
        valueGetter: (params) =>
            `${params.row.paciente?.paciente || ''}`,
    },
    { field: 'estado', headerName: 'ESTADO', flex: 1 },

   

];

