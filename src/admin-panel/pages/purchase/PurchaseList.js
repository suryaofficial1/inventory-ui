import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Delete, Edit, Refresh, Search, Visibility } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { DELETE_PURCHASE, PURCHASE_LIST } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { showMessage } from '../../../utils/message';
import { sendDeleteRequest, sendGetRequest } from '../../../utils/network';
import PurchaseFilter from './PurchaseFilter';
import PurchaseAction from './PurchaseAction';
import moment from 'moment';
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

const PurchaseList = () => {
    const classes = useStyles();

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState({ pName: '', sName: '', });
    const [tempFilter, setTempFilter] = useState({ pName: '', sName: '', });
    const [totalRecords, setTotalRecords] = useState(0);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [readOnly, setReadOnly] = useState(false);
    const [{ start, stop }, Loader, loading] = useLoader();
    const user = useSelector((state) => state.user);


    useEffect(() => {
        getPurchaseList();
    }, [page, filter]);

    const getPurchaseList = () => {
        start();
        sendGetRequest(`${PURCHASE_LIST}?pName=${filter.pName}&sName=${filter.sName}&page=${page + 1}&per_page=10`, "token")
            .then((res) => {
                if (res.status === 200) {
                    setRows(res.data.rows);
                    setTotalRecords(res.data.total);
                } else {
                    console.log("Erorr in get purchase list", res.data);
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
        start();
        sendDeleteRequest(`${DELETE_PURCHASE(row.id)}`, "token")
            .then((res) => {
                if (res.status === 200) {
                    getPurchaseList();
                    showMessage('success', 'Purchase record deleted successfully');
                } else {
                    console.log("Error in delete purchase", res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(stop);
    };

    const columns = [
        { field: 'id', headerName: '#Id', width: 80, sortable: true },
        {
            field: 'supplierName', headerName: 'Supplier Name', width: 150, sortable: true,
            renderCell: (params) => (
                params.row.supplier.name ? params.row.supplier.name : ""
            )
        },
        {
            field: 'product', headerName: 'Product', width: 120, resizable: false, sortable: false,
            renderCell: (params) => (
                params.row.product.name ? params.row.product.name + " - " + params.row.product.pCode : ''
            )
        },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'qty', headerName: 'Quantity', width: 120 },
        { field: 'price', headerName: 'Price', width: 120 },
        {
            field: 'purchaseDate', headerName: 'Purchase Date', width: 150,
            renderCell: (params) => (
                params.row.purchaseDate ? moment(params.row.purchaseDate).local().format('DD-MM-YYYY') : ''
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
        setFilter({ pName: '', sName: '', });
        setTempFilter({ pName: '', sName: '', });
        setPage(0);
    };

    return (
        <div>
            <Loader />
            <div className={classes.addBtn}>
                <PurchaseFilter reset={resetAllData} filter={tempFilter} setFilter={setTempFilter} />
            </div>
            <div>
                {roleBasePolicy(user?.role) && <Button startIcon={<Add />} className={classes.actionButton} variant="contained" color="primary" onClick={() => setOpen(!open)}>Add Purchase</Button>}
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

            {open && <PurchaseAction
                selectedData={editData}
                readOnly={readOnly}
                onClose={onClose}
                successAction={getPurchaseList}
                title={readOnly ? 'View Purchase Details' : editData.id ? 'Edit Purchase Detail' : 'Add Purchase Detail'}
            />}
        </div>
    );
};

export default PurchaseList;