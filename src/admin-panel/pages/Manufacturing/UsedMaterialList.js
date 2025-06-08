import { DataGrid } from '@material-ui/data-grid';
import React from 'react'

const UsedMaterialList = ({ list }) => {

    const columns = [
        {
            field: 'id',
            headerName: '#Id',
            width: 80,
            sortable: true,
        },

        {
            field: 'supplier', headerName: 'Supplier', width: 200, resizable: true, sortable: false,
            renderCell: (params) => (
                params.row.supplier?.name ? params.row.supplier.name : ""
            )
        },
        {
            field: 'product', headerName: 'Product', width: 200, resizable: true, sortable: false,
            renderCell: (params) => (
                params.row.product?.name ? params.row.product.name : ""
            )
        },
        {
            field: 'mqty',
            headerName: 'Quantity',
            width: 100,
            sortable: false,
        },
        {
            field: 'mPrice',
            headerName: 'Price',
            width: 100,
            sortable: false,
        },
        {
            field: 'rqty',
            headerName: 'Rejection Quantity',
            width: 150,
            sortable: false,
        },
        {
            field: 'rPrice',
            headerName: 'Rejection Price',
            width: 150,
            sortable: false,
        },
        {
            field: 'lqty',
            headerName: 'Lumps Quantity',
            width: 150,
            sortable: false,
        },
        {
            field: 'lPrice',
            headerName: 'Lumps Price',
            width: 150,
            sortable: false,
        },
    ]

    return <DataGrid
        style={{ width: '100% !important' }}
        autoHeight
        pagination
        pageSize={5}
        rowsPerPageOptions={[5]}
        columns={columns}
        rows={list}
        disableColumnMenu
        disableMultipleSelection
        disableSelectionOnClick

    />
}

export default UsedMaterialList;