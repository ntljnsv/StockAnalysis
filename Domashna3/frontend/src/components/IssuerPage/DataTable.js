import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'date', headerName: 'Датум', flex: 1, minWidth: 80 },
    { field: 'lastTransactionPrice', headerName: 'Цена на последна трансакција',flex: 1, minWidth: 100 },
    { field: 'maxPrice', headerName: 'Макс. цена', flex: 1, minWidth: 80 },
    { field: 'minPrice', headerName: 'Мин. цена', flex: 1, minWidth: 80 },
    { field: 'avgPrice', headerName: 'Просечна цена', flex: 1, minWidth: 80 },
    { field: 'percentageChange', headerName: 'Промена (%)', flex: 1, minWidth: 80 },
    { field: 'volume', headerName: 'Волумен', flex: 1, minWidth: 150 },
    { field: 'turnover', headerName: 'Промет во БЕСТ', flex: 1, minWidth: 150 },
    { field: 'totalTurnover', headerName: 'Вкупен промет', flex: 1, minWidth: 150 },
];


const DataTable = ({data}) => {
    return (
        <div style={{ height: 800, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[10, 25, 50]}
                pagination
                sx={{
                    '& .MuiDataGrid-columnHeaderTitleContainer': {
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 'bold',
                        textAlign: 'center',
                        whiteSpace: 'normal',
                        lineHeight: '1',
                    },
                    '& .MuiDataGrid-columnHeader': {
                        backgroundColor: '#b41438',
                        color: 'white',
                        display: 'flex',
                    },
                    '& .MuiDataGrid-cell': {
                        textAlign: 'center',
                        borderBottom: '1px solid #e0e0e0',
                    },
                    '& .MuiDataGrid-row:nth-of-type(odd)': {
                        backgroundColor: '#f9f9f9',
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: '#e6f7ff',
                        cursor: 'pointer',
                    },
                }}
            />
        </div>
    );
}

export default DataTable;
