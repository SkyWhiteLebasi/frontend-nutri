export const PedidodPisosColumns = [
    // { field: 'id', headerName: 'ID', flex: 0.5},
  
    { field: 'fecha_pedido', headerName: 'FECHA PEDIDO', flex: 1.5 },
    { field: 'alimento', headerName: 'ALIMENTO', flex: 1.5, editable: true},
    {
        field: 'paciente_id',
        headerName: 'PISO/AREA',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        flex: 2,
        // width: 270,
        valueGetter: (params) =>
            `${params.row.piso?.nombre_piso || ''}`,
    },
    { field: 'estado', headerName: 'ESTADO', flex: 2 },

   

];

