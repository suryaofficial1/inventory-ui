import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Delete, Edit, Refresh, Search, Visibility } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { DELETE_SALES, SALES_LIST } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { showMessage } from '../../../utils/message';
import { sendDeleteRequest, sendGetRequest } from '../../../utils/network';
import SalesFilter from './SalesFilter';
import SalesAction from './SalesAction';
import moment from 'moment';
import { roleBasePolicy } from '../../../utils/Constent';
import { useSelector } from 'react-redux';
import ActionButton from '../../../common/action-button/ActionButton';

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

const SalesList = () => {
    const classes = useStyles();

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState({ cName: '', pName: '' });
    const [tempFilter, setTempFilter] = useState({ cName: '', pName: '' });
    const [totalRecords, setTotalRecords] = useState(0);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [readOnly, setReadOnly] = useState(false);
    const [{ start, stop }, Loader, loading] = useLoader();
    const user = useSelector((state) => state.user);

    useEffect(() => {
        getSalesList();
    }, [page, filter]);
    const getSalesList = () => {
        start()
        sendGetRequest(`${SALES_LIST}?cName=${filter.cName}&pName=${filter.pName}&page=${page + 1}&per_page=10`, "token")
            .then(res => {
                if (res.status === 200) {
                    setRows(res.data.rows)
                    setTotalRecords(res.data.total)
                } else {
                    console.log(res)
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
        sendDeleteRequest(`${DELETE_SALES(row.id)}`, "token")
            .then(res => {
                if (res.status === 200) {
                    getSalesList();
                    showMessage('success', 'Sales record deleted successfully');
                } else {
                    console.log(res)
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

        {
            field: 'customer', headerName: 'Customer Name', width: 120, resizable: false, sortable: false,
            renderCell: (params) => (
                params.row.customer.name ? params.row.customer.name : ""
            )
        },
        {
            field: 'product', headerName: 'Product', width: 120, resizable: false, sortable: false,
            renderCell: (params) => (
                params.row.product.name ? params.row.product.name + " - " + params.row.product.pCode : ''
            )
        },
        { field: 'pDesc', headerName: 'Product Desc', width: 220, resizable: false, sortable: false, },

        { field: 'qty', headerName: 'Quantity', width: 110, resizable: true, sortable: false },
        { field: 'salesPrice', headerName: 'Sales Price', width: 110, resizable: true, sortable: false },
        {
            field: 'salesDate', headerName: 'Sales Date', width: 120, resizable: false, sortable: false,
            renderCell: (params) => (
                params.row.salesDate ? moment(params.row.salesDate).local().format('DD-MM-YYYY') : ''
            )
        },
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
        setFilter({ cName: '', pName: '' });
        setTempFilter({ cName: '', pName: '' });
        setPage(0)
    }

    return (
        <div >
            <Loader />
            <div className={classes.addBtn}>
                <SalesFilter reset={resetAllData} filter={tempFilter} setFilter={setTempFilter} />
            </div>
            <div>
                {roleBasePolicy(user?.role) && <Button startIcon={<Add />} className={classes.actionButton} variant="contained" color="primary" onClick={() => setOpen(!open)}>Add Sales</Button>}
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

            {open && <SalesAction
                selectedData={editData}
                readOnly={readOnly}
                onClose={onClose}
                successAction={getSalesList}
                title={readOnly ? 'View Sales Details' : editData.id ? 'Edit Sales Detail' : 'Add Sales Detail'}
            />}
        </div>
    );
};

export default SalesList;
