import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Delete, Edit, Refresh, Search, Visibility } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { DELETE_CUSTOMER, CUSTOMER_LIST } from '../../../config/api-urls';
import { sendDeleteRequest, sendGetRequest } from '../../../utils/network';
import { useLoader } from '../../../hooks/useLoader';
import { showMessage } from '../../../utils/message';
import CustomerAction from './CustomerAction';
import Filter from './Filter';

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

const CustomerList = () => {
    const classes = useStyles();

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState({ name: '', cCode: '', location: '', gstin: '' });
    const [tempFilter, setTempFilter] = useState({ name: '', cCode: '', location: '', gstin: '' }); // Temporary filter for user input
    const [totalRecords, setTotalRecords] = useState(0);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [readOnly, setReadOnly] = useState(false);
    const [{ start, stop }, Loader, loading] = useLoader();


    useEffect(() => {
        getCustomer();
    }, [page, filter]);
    const getCustomer = () => {
        start()
        sendGetRequest(`${CUSTOMER_LIST}?name=${filter.name}&cCode=${filter.cCode}&location=${filter.location}&gstin=${filter.gstin}&page=${page + 1}&per_page=10`, "token")
            .then(res => {
                if (res.status === 200) {
                    setRows(res.data.rows)
                    setTotalRecords(res.data.total)
                } else {
                    console.log(res.data)
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
        sendDeleteRequest(`${DELETE_CUSTOMER(row.id)}`, "token")
            .then(res => {
                if (res.status === 200) {
                    getCustomer();
                    showMessage('success', 'Customer deleted successfully');
                } else {
                    console.log("Error in delete customer ", res.data)
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

        { field: 'name', headerName: 'Name', width: 120, resizable: false, sortable: false, },
        { field: 'cCode', headerName: 'Customer code', width: 120, resizable: false, sortable: false, },
        { field: 'address', headerName: 'Address', width: 180, resizable: true, sortable: false },
        { field: 'location', headerName: 'location', width: 110, resizable: true, sortable: false },
        { field: 'contact', headerName: 'Contact', width: 110, resizable: true, sortable: false },
        { field: 'gstin', headerName: 'GSTIN', width: 140, resizable: true, sortable: false },
        {
            field: 'status', headerName: 'Status', width: 100, resizable: true, sortable: false,
            renderCell: (params) => (
                (params.row.status === 1) ? <span style={{ color: "green" }}>Active</span> : <span style={{ color: "red" }}>Inactive</span>
            )
        },
        {
            field: "Action", headerName: "Action", width: 200, resizable: true, sortable: false,
            renderCell: (params) => (
                <div className={classes.actionIcons}>
                    <Edit color="primary" onClick={() => handleAction(params.row, 'edit')} />
                    <Visibility color="action" onClick={() => handleAction(params.row, 'view')} />
                    <Delete color="secondary" onClick={() => deleteAction(params.row)} />
                </div>
            ),
        },
    ];

    const applyFilter = () => {
        setFilter(tempFilter);
        setPage(0)
    }

    const resetAllData = ({ name = "", cCode = "", location = "", gstin = '' }) => {
        setFilter({ ...filter, name, cCode, location, gstin });
        setTempFilter({ name: '', cCode: '', location: '', gstin: '' });
        setPage(0)
    }

    return (
        <div >
            <Loader />
            <div className={classes.addBtn}>
                <Filter reset={resetAllData} filter={tempFilter} setFilter={setTempFilter} />
            </div>
            <div>
                <Button startIcon={<Add />} className={classes.actionButton} variant="contained" color="primary" onClick={() => setOpen(!open)}>Add Customer</Button>
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

            {open && <CustomerAction
                selectedData={editData}
                readOnly={readOnly}
                onClose={onClose}
                successAction={getCustomer}
                title={readOnly ? 'View Customer' : editData.id ? 'Edit Customer' : 'Add Customer'}
            />}
        </div>
    );
};

export default CustomerList;
