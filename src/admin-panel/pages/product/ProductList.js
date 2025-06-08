import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Refresh, Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import NameActionButtons from '../../../common/action-button/NameActionButtons';
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
    const [filter, setFilter] = useState({ productId: "", type: 'all' });
    const [tempFilter, setTempFilter] = useState({ productId: "", type: 'all' });
    const [clearSignal, setClearSignal] = useState(0);
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
        sendGetRequest(`${PRODUCT_LIST}?type=${filter.type !== 'all' ? filter.type : ""}&productId=${filter?.productId ? filter?.productId : ""}&page=${page + 1}&per_page=10`, user.token)
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
            field: "Action", align: "center", headerName: "Action", width: 250, resizable: true, sortable: false,
            renderCell: (params) => (
                <NameActionButtons
                    params={params}
                    handleAction={handleAction}
                    deleteAction={deleteAction}
                />
            )
        },
        {
            field: 'id',
            headerName: '#Id',
            width: 80,
            sortable: false,
        },
        { field: 'name', headerName: 'Product Name', width: 180, resizable: true, sortable: false, },
        { field: 'type', headerName: 'Type', width: 130, resizable: true, sortable: false },
        { field: 'unit', headerName: 'Unit', width: 110, resizable: true, sortable: false },
        { field: 'qty', headerName: 'quantity', width: 110, resizable: true, sortable: false },
        { field: 'price', headerName: 'Price', width: 110, resizable: true, sortable: false },
        {
            field: 'description', headerName: 'Description', width: 300, resizable: true, sortable: false,
            renderCell: (params) => {
                return (
                    params.row.description ? <textarea readOnly>{params.row.description}</textarea> : ""
                )
            }
        },
        {
            field: 'status', headerName: 'Status', width: 100, resizable: true, sortable: false,
            renderCell: (params) => (
                (params.row.status === 1) ? <span style={{ color: "green" }}>Active</span> : <span style={{ color: "red" }}>Inactive</span>
            )
        },
    ];

    const applyFilter = () => {
        setFilter(tempFilter);
        setPage(0)
    }

    const resetAllData = () => {
        setFilter({ productId: '', type: 'all' });
        setTempFilter({ productId: '', type: 'all' });
        setPage(0);
        setClearSignal(prev => prev + 1); 
    };

    return (
        <div >
            <Loader />
            <div className={classes.addBtn}>
                <Filter
                    reset={resetAllData}
                    filter={tempFilter}
                    setFilter={setTempFilter}
                    clearSignal={clearSignal}
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
                rowHeight={100}
                pagination
                style={{ background: "#fff", width: "100%", lineHeight: "55 !important" }}
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
            />}
        </div>
    );
};

export default ProductList;
