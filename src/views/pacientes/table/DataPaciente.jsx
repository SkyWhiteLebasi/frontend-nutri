export const PacientesColumns = [
    // { field: 'id', headerName: 'ID', width: 70 },
   
    // {
    //     field: 'servicio_id',
    //     headerName: 'SERVICIO',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     flex: 3,
    //     valueGetter: (params) =>
    //         `${params.row.servicio?.servintern || ''}`,
    // },


    { field: 'dni_paciente', headerName: 'DNI', flex: 1.5, width:'75px'},
    { field: 'paciente', headerName: 'PACIENTE', width: '250'},
    {
        field: 'estacion_id',
        headerName: 'ESTACION',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width:'150px',
        flex: 2,
        valueGetter: (params) =>
            `${params.row.estacion?.desc_estacion || ''}`,
    },
    // { field: 'habitacion', headerName: 'HABITACION', flex: 1 },
    // { field: 'cama', headerName: 'CAMA', flex: 1 },

    {
        field: 'hospital_id',
        headerName: 'CENTRO',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: '150px',
        flex: 2,
        valueGetter: (params) =>
            `${params.row.hospital?.desc_red || ''}`,
    },

];

