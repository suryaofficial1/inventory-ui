import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Refresh, Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import ActionButton from '../../../common/action-button/ActionButton';
import { DELETE_RETURN_PURCHASE, PURCHASE_RETURN_LIST } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { roleBasePolicy } from '../../../utils/Constent';
import { sendDeleteRequest, sendGetRequest } from '../../../utils/network';
import Action from './Action';
import PurchaseFilter from './Filter';

const useStyles = makeStyles({
    actionIcons: {
        display: 'flex',
        gap: 15,
        cursor: 'pointer',
    },
    addBtn: {
        padding: 10,
    },
    actionButton: {
        padding: "5px 15px",
        marginRight: 10,
        borderRadius: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
});

const ReturnList = () => {
    const classes = useStyles();

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState({ pName: {}, sName: '' });
    const [tempFilter, setTempFilter] = useState({ pName: {}, sName: '' });
    const [clearSignal, setClearSignal] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [readOnly, setReadOnly] = useState(false);
    const [conform, setConform] = useState({});
    const [{ start, stop }, Loader, loading] = useLoader();
    const user = useSelector((state) => state.user);


    useEffect(() => {
        getReturnList();
    }, [page, filter]);

    const getReturnList = () => {
        start();
        sendGetRequest(`${PURCHASE_RETURN_LIST}?pName=${filter?.pName?.id ? filter?.pName.name : ""}&sName=${filter?.sName ? filter?.sName.name : ""}&page=${page + 1}&per_page=10`, user.token)
            .then((res) => {
                if (res.status === 200) {
                    setRows(res.data.rows);
                    setTotalRecords(res.data.total);
                } else {
                    console.log("Error in get return purchase list", res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(stop);
    };

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
        sendDeleteRequest(`${DELETE_RETURN_PURCHASE(row.id)}`, user.token)
            .then((res) => {
                if (res.status === 200) {
                    getReturnList();
                    Swal.fire("Return Purchase record deleted successfully!", "", "success");
                } else {
                    console.log("Error in delete purchase return", res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(stop);
    };


    const columns = [
        { field: 'id', headerName: '#Id', width: 80, sortable: true },
        { field: 'invoiceNo', headerName: 'Invoice No', width: 130, sortable: false },
        { field: 'bNumber', headerName: 'Batch Number', width: 160, sortable: false },
        {
            field: 'supplierName', headerName: 'Supplier Name', width: 200, sortable: true,
            renderCell: (params) => (
                params.row.supplier.name ? params.row.supplier.name : ""
            )
        },
        {
            field: 'product', headerName: 'Product', width: 200, resizable: true, sortable: false,
            renderCell: (params) => (
                params.row.product.name ? params.row.product.name : ""
            )
        }, {
            field: 'rDesc', headerName: 'desc', width: 200, resizable: true, sortable: false,
            renderCell: (params) => {
                return (
                    params.row.rDesc ? <textarea readOnly>{params.row.rDesc}</textarea> : ''
                )
            }
        },
        { field: 'qty', headerName: 'Quantity', width: 120 },
        { field: 'price', headerName: 'Price', width: 120 },
        {
            field: 'returnDate', headerName: 'Return Date', width: 150,
            renderCell: (params) => (
                params.row.returnDate ? moment(params.row.returnDate).local().format('DD-MM-YYYY') : ''
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
        setPage(0);
    };

    const resetAllData = () => {
        setFilter({ pName: null, sName: null });
        setTempFilter({ pName: null, sName: null });
        setPage(0);
        setClearSignal(prev => prev + 1);

    };

    return (
        <div>
            <Loader />
            <div className={classes.addBtn}>
                <PurchaseFilter reset={resetAllData} filter={tempFilter} setFilter={setTempFilter} clearSignal={clearSignal} />
            </div>
            <div>
                {roleBasePolicy(user?.role) && <Button startIcon={<Add />} className={classes.actionButton}
                    variant="contained" color="primary" onClick={() => setOpen(!open)}>
                    Add Return Purchase
                </Button>
                }
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
                successAction={getReturnList}
                title={readOnly ? 'View  Return Purchase Details' : editData.id ? 'Edit Return Purchase Detail' : 'Add Return Purchase Detail'}
            />}
        </div>
    );
};

export default ReturnList;