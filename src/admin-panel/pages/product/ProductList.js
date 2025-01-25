import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Delete, Edit, Refresh, Search, Visibility } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { DELETE_PRODUCT, PRODUCT_LIST } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { showMessage } from '../../../utils/message';
import { sendDeleteRequest, sendGetRequest } from '../../../utils/network';
import ProductAction from './ProductAction';
import Filter from './ProductFilter';
import ActionButton from '../../../common/action-button/ActionButton';
import { roleBasePolicy } from '../../../utils/Constent';
import { useSelector } from 'react-redux';

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
    const [filter, setFilter] = useState({ name: '' });
    const [tempFilter, setTempFilter] = useState({ name: '' });
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
        sendGetRequest(`${PRODUCT_LIST}?name=${filter.name}&page=${page + 1}&per_page=10`, "token")
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
        start()
        sendDeleteRequest(`${DELETE_PRODUCT(row.id)}`, "token")
            .then(res => {
                if (res.status === 200) {
                    getProducts();
                    showMessage('success', 'Product deleted successfully');
                } else {
                    console.log("Error in delete product", res.data)
                }
            }).catch(err => {
                console.log(err)
            }).finally(stop)
    }

    const columns = [
        {
            field: 'id',
            headerName: '#Id',
            width: 80,
            sortable: true,
        },

        { field: 'pCode', headerName: 'Product Code', width: 120, resizable: false, sortable: false, },
        { field: 'description', headerName: 'Description', width: 220, resizable: false, sortable: false, },

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
        setFilter(tempFilter);
        setPage(0)
    }

    const resetAllData = () => {
        setFilter({ name: '' });
        setTempFilter({ name: '', });
        setPage(0)
    }

    return (
        <div >
            <Loader />
            <div className={classes.addBtn}>
                <Filter reset={resetAllData} filter={tempFilter} setFilter={setTempFilter} />
            </div>
            <div>
                {roleBasePolicy(user?.role) && <Button startIcon={<Add />} className={classes.actionButton} variant="contained" color="primary" onClick={() => setOpen(!open)}>Add Product</Button>}
                <Button startIcon={<Search />} className={classes.actionButton} variant="contained" color="primary" onClick={applyFilter}>Search</Button>
                <Button startIcon={<Refresh />} className={classes.actionButton} variant="contained" color="secondary" onClick={resetAllData}>Reset</Button>
            </div>
            <DataGrid autoHeight pagination style={{ background: "#fff", width: "100%" }}
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
