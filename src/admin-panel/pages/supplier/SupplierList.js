import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Refresh, Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import ActionButton from '../../../common/action-button/ActionButton';
import { DELETE_SUPPLIER, SUPPLIER_LIST } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { roleBasePolicy } from '../../../utils/Constent';
import { sendDeleteRequest, sendGetRequest } from '../../../utils/network';
import Filter from './Filter';
import SupplierAction from './SupplierAction';

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

const SupplierList = () => {
    const classes = useStyles();

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState({ name: '', vendorCode: '', location: '', gstin: '' });
    const [tempFilter, setTempFilter] = useState({ name: '', vendorCode: '', location: '', gstin: '' }); // Temporary filter for user input
    const [totalRecords, setTotalRecords] = useState(0);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [readOnly, setReadOnly] = useState(false);
    const [{ start, stop }, Loader, loading] = useLoader();
    const user = useSelector((state) => state.user);

    useEffect(() => {
        getSupplier();
    }, [page, filter]);
    const getSupplier = () => {
        start()
        sendGetRequest(`${SUPPLIER_LIST}?name=${filter.name}&vendorCode=${filter.vendorCode}&location=${filter.location}&gstin=${filter.gstin}&page=${page + 1}&per_page=10`, user.token)
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
        sendDeleteRequest(`${DELETE_SUPPLIER(row.id)}`, user.token)
            .then((res) => {
                if (res.status === 200) {
                    getSupplier();
                    Swal.fire("Supplier deleted successfully!", "", "success");
                } else {
                    console.log("Error in delete supplier", res.data);
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

        { field: 'name', headerName: 'Name', width: 140, resizable: false, sortable: false, },
        { field: 'vendorCode', headerName: 'Vendor code', width: 120, resizable: false, sortable: false },
        {
            field: 'address', headerName: 'Address', width: 200, resizable: true, sortable: false,
            renderCell: (params) => {
                return (
                    params.row.address ? <textarea readOnly>{params.row.address}</textarea> : ''
                )
            }
        },
        { field: 'location', headerName: 'location', width: 110, resizable: true, sortable: false },
        { field: 'contact', headerName: 'Contact', width: 110, resizable: true, sortable: false },
        { field: 'gstin', headerName: 'GSTIN', width: 180, resizable: true, sortable: false },
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

    const resetAllData = ({ name = "", vendorCode = "", location = "", gstin = '' }) => {
        setFilter({ ...filter, name, vendorCode, location, gstin });
        setTempFilter({ name: '', vendorCode: '', location: '', gstin: '' });
        setPage(0)
    }

    return (
        <div >
            <Loader />
            <div className={classes.addBtn}>
                <Filter reset={resetAllData} filter={tempFilter} setFilter={setTempFilter} />
            </div>
            <div>
                {roleBasePolicy(user?.role) && <Button startIcon={<Add />} className={classes.actionButton} variant="contained" color="primary" onClick={() => setOpen(!open)}>Add Supplier</Button>}
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

            {open && <SupplierAction
                selectedData={editData}
                readOnly={readOnly}
                onClose={onClose}
                successAction={getSupplier}
                title={readOnly ? 'View Supplier' : editData.id ? 'Edit Supplier' : 'Add Supplier'}
            />}
        </div>
    );
};

export default SupplierList;
