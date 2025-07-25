import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Refresh, Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import ActionButton from '../../../common/action-button/ActionButton';
import { DELETE_RETURN_SALES, SALES_RETURN_LIST } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { roleBasePolicy } from '../../../utils/Constent';
import { sendDeleteRequest, sendGetRequest } from '../../../utils/network';
import Action from './Action';
import ReturnFilter from './ReturnFilter';

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

const SalesReturnList = () => {
    const classes = useStyles();

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState({ cName: '', pName: {} });
    const [tempFilter, setTempFilter] = useState({ cName: '', pName: {} });
    const [clearSignal, setClearSignal] = useState(0);
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
        sendGetRequest(`${SALES_RETURN_LIST}?cName=${filter?.cName ? filter?.cName.name : ""}&pName=${filter?.pName?.id ? filter?.pName.id : ""}&page=${page + 1}&per_page=10`, user.token)
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
        sendDeleteRequest(`${DELETE_RETURN_SALES(row.id)}`, user.token)
            .then((res) => {
                if (res.status === 200) {
                    getSalesList();
                    Swal.fire("Return Sales record deleted successfully!", "", "success");
                } else {
                    console.log("Error in delete return Sales", res.data);
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
        { field: 'salesName', headerName: 'Sales Name', width: 130, sortable: false },
        { field: 'batchNo', headerName: 'Production Batch', width: 180, sortable: false, resizable: true },
        {
            field: 'customer', headerName: 'Customer Name', width: 150, resizable: true, sortable: false,
            renderCell: (params) => (
                params.row.customer.name ? params.row.customer.name : ""
            )
        },
        {
            field: 'product', headerName: 'Product', width: 150, resizable: true, sortable: false,
            renderCell: (params) => (
                params.row.product.name ? params.row.product.name : ''
            )
        },
        { field: 'invoiceNo', headerName: 'Invoice No', width: 130, sortable: false },
        { field: 'qty', headerName: 'Quantity', width: 110, resizable: true, sortable: false },
        { field: 'salesPrice', headerName: 'Sales Price', width: 110, resizable: true, sortable: false },
        {
            field: 'returnDate', headerName: 'Return Date', width: 120, resizable: false, sortable: false,
            renderCell: (params) => (
                params.row.returnDate ? moment(params.row.returnDate).local().format('DD-MM-YYYY') : ''
            )
        },
        { field: 'unit', headerName: 'Unit', width: 110, resizable: true, sortable: false },
        {
            field: 'rDesc', headerName: 'Description', width: 220, resizable: false, sortable: false,
            renderCell: (params) => {
                return (
                    params.row.rDesc ? <textarea readOnly>{params.row.rDesc}</textarea> : ''
                )
            }
        },
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
        setFilter({ cName: null, pName: null });
        setTempFilter({ cName: null, pName: null });
        setPage(0)
        setClearSignal(prev => prev + 1);
    }

    return (
        <div >
            <Loader />
            <div className={classes.addBtn}>
                <ReturnFilter 
                reset={resetAllData}
                 filter={tempFilter}
                  setFilter={setTempFilter}
                  clearSignal={clearSignal} />
            </div>
            <div>
                {roleBasePolicy(user?.role) && <Button startIcon={<Add />} className={classes.actionButton} variant="contained" color="primary" onClick={() => setOpen(!open)}>Add Return Sales</Button>}
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

            {open && <Action
                selectedData={editData}
                readOnly={readOnly}
                onClose={onClose}
                successAction={getSalesList}
                title={readOnly ? 'View Return Sales Details' : editData.id ? 'Edit Return Sales Detail' : 'Add Return Sales Detail'}
            />}
        </div>
    );
};

export default SalesReturnList;
