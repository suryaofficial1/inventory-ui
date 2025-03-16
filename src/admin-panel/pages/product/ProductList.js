import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Refresh, Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import ActionButton from '../../../common/action-button/ActionButton';
import { DELETE_PRODUCT, PRODUCT_LIST } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { roleBasePolicy } from '../../../utils/Constent';
import { sendDeleteRequest, sendGetRequest } from '../../../utils/network';
import ProductAction from './ProductAction';
import Filter from './ProductFilter';

const useStyles = makeStyles({
    actionIcons: {
        display: 'flex',
        gap: 15,
        cursor: 'pointer',
    },
    addBtn: {
        padding: 10
    },
    actionButton: {
        padding: "5px 15px",
        marginRight: 10,
        borderRadius: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    }
});

const ProductList = () => {
    const classes = useStyles();

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState({ name: "" });
    const [tempFilter, setTempFilter] = useState({ name: "" });
    const [totalRecords, setTotalRecords] = useState(0);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [readOnly, setReadOnly] = useState(false);
    const [{ start, stop }, Loader, loading] = useLoader();
    const user = useSelector((state) => state.user);

    useEffect(() => {
        getProducts();
    }, [page, filter]);

    const getProducts = () => {
        start()
        sendGetRequest(`${PRODUCT_LIST}?name=${filter?.name ? filter?.name.name : ""}&page=${page + 1}&per_page=10`, user.token)
            .then(res => {
                if (res.status === 200) {
                    setRows(res.data.rows)
                    setTotalRecords(res.data.total)
                } else {
                    console.log("Error in get products", res.data)
                }
            }).catch(err => {
                console.log(err)
            }).finally(stop)
    }

    const onClose = () => {
        setOpen(!open);
        setReadOnly(false);
        setEditData({});
    };


    const handleAction = (row, mode) => {
        setOpen(true);
        setEditData(row);
        setReadOnly(mode === 'view');
    };

    const deleteAction = (row) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will also delete related records! You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteData(row)
            } else if (result.dismiss) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    };

    const deleteData = (row) => {
        start();
        sendDeleteRequest(`${DELETE_PRODUCT(row.id)}`, user.token)
            .then((res) => {
                if (res.status === 200) {
                    getProducts();
                    Swal.fire("Product deleted successfully!", "", "success");
                } else {
                    console.log("Error in delete Product", res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(stop);
    };

    const columns = [
        {
            field: 'id',
            headerName: '#Id',
            width: 80,
            sortable: true,
        },

        { field: 'name', headerName: 'Product Name', width: 180, resizable: false, sortable: false, },
        {
            field: 'description', headerName: 'Description', width: 300, resizable: false, sortable: false,
            // renderCell: (params) => {
            //     return (
            //         <textarea readOnly>{params.row.description}</textarea>
            //     )
            // }
        },
        { field: 'qty', headerName: 'quantity', width: 110, resizable: true, sortable: false },
        { field: 'price', headerName: 'Price', width: 110, resizable: true, sortable: false },
        { field: 'unit', headerName: 'Unit', width: 110, resizable: true, sortable: false },
        {
            field: 'status', headerName: 'Status', width: 100, resizable: true, sortable: false,
            renderCell: (params) => (
                (params.row.status === 1) ? <span style={{ color: "green" }}>Active</span> : <span style={{ color: "red" }}>Inactive</span>
            )
        },
        {
            field: "Action", headerName: "Action", width: 200, resizable: true, sortable: false,
            renderCell: (params) => (
                <ActionButton
                    params={params}
                    handleAction={handleAction}
                    deleteAction={deleteAction}
                />
            )
        }
    ];

    const applyFilter = () => {
        console.log("tempFilter", tempFilter)
        setFilter(tempFilter);
        setPage(0)
    }

    const resetAllData = () => {
        setFilter({ name: null });
        setTempFilter({ name: null, });
        setPage(0)
    }

    return (
        <div >
            <Loader />
            <div className={classes.addBtn}>
                <Filter
                    reset={resetAllData}
                    filter={tempFilter}
                    setFilter={setTempFilter}
                />
            </div>
            <div>
                {roleBasePolicy(user?.role) && <Button startIcon={<Add />} className={classes.actionButton} variant="contained" color="primary" onClick={() => setOpen(!open)}>Add Product</Button>}
                <Button startIcon={<Search />} className={classes.actionButton} variant="contained" color="primary" onClick={applyFilter}>Search</Button>
                <Button startIcon={<Refresh />} className={classes.actionButton} variant="contained" color="secondary" onClick={resetAllData}>Reset</Button>
            </div>
            <DataGrid
                autoHeight
                // row
                rowHeight={85}
                pagination
                style={{ background: "#fff", width: "100%" }}
                rows={rows}
                columns={columns}
                page={page}
                pageSize={10}
                rowsPerPageOptions={[10]}
                rowCount={(totalRecords) ? totalRecords : 100}
                loading={loading}
                paginationMode="server"
                onPageChange={(newPage) => setPage(newPage)}
                disableColumnMenu
                disableColumnFilter
                getRowClassName={(params) =>
                    params.api.getRowIndex(params.id) % 2 === 0 ? "even-row" : "odd-row"
                }
            />
            {open && <ProductAction
                selectedData={editData}
                readOnly={readOnly}
                onClose={onClose}
                successAction={getProducts}
                title={readOnly ? 'View Product' : editData.id ? 'Edit Product' : 'Add Product'}
            />}
        </div>
    );
};

export default ProductList;
