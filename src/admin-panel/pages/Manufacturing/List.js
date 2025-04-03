import { Button, Chip } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Refresh, Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import ActionButton from '../../../common/action-button/ActionButton';
import { PRODUCTION_LIST } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { roleBasePolicy } from '../../../utils/Constent';
import { sendDeleteRequest, sendGetRequest } from '../../../utils/network';
import ProductionAction from './Action';
import Filter from './Filter';

const useStyles = makeStyles({

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

const ManufacturingList = () => {
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
        getProductionList();
    }, [page, filter]);
    const getProductionList = () => {
        start()
        sendGetRequest(`${PRODUCTION_LIST}?cName=${filter?.cName ? filter?.cName.name : ""}&pName=${filter?.pName ? filter?.pName.name : ""}&page=${page + 1}&per_page=10`, user.token)
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
        sendDeleteRequest(`${DELETE_PRODUCTION(row.id)}`, user.token)
            .then((res) => {
                if (res.status === 200) {
                    getSalesList();
                    Swal.fire("Production deleted successfully!", "", "success");
                } else {
                    console.log("Error in delete production", res.data);
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

        {
            field: 'customer', headerName: 'Customer', width: 150, resizable: false, sortable: false,
            renderCell: (params) => (
                params.row.customer?.name ? params.row.customer.name : ""
            )
        },
        {
            field: 'product', headerName: 'Product', width: 160, resizable: false, sortable: false,
            renderCell: (params) => (
                params.row.product?.name ? params.row.product.name : ''
            )
        },


        { field: 'qty', headerName: 'Quantity', width: 110, resizable: true, sortable: false },
        { field: 'unit', headerName: 'Unit', width: 110, resizable: true, sortable: false },

        { field: 'operatorName', headerName: 'Operator', width: 140, resizable: true, sortable: false },

        {
            field: 'materials', headerName: 'Raw Material', width: 150, resizable: false, sortable: false,
            renderCell: (params) => (
                params.row.materials ? <Chip label={JSON.parse(params.row.materials).join(', ')} /> : ""
            )
        },
        { field: 'mqty', headerName: 'Material Quantity', width: 160, resizable: true, sortable: false },
        { field: 'mPrice', headerName: 'Material Price', width: 160, resizable: true, sortable: false },
        { field: 'rqty', headerName: 'Rejection  Quantity', width: 160, resizable: true, sortable: false },
        { field: 'rPrice', headerName: 'Rejection  Price', width: 160, resizable: true, sortable: false },
        { field: 'lqty', headerName: 'Lumps Quantity', width: 160, resizable: true, sortable: false },
        { field: 'lPrice', headerName: 'Lumps Price', width: 160, resizable: true, sortable: false },
        {
            field: 'pDesc', headerName: 'Product Desc', width: 220, resizable: false, sortable: false,
            renderCell: (params) => {
                return (
                    params.row.pDesc ? <textarea readOnly>{params.row.pDesc}</textarea> : ''
                )
            }
        },
        {
            field: 'manufacturingDate', headerName: 'Manufacturing Date', width: 180, resizable: false, sortable: false,
            renderCell: (params) => (
                params.row.manufacturingDate ? moment(params.row.manufacturingDate).local().format('DD-MM-YYYY') : ''
            )
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
        setFilter({ cName: '', pName: '' });
        setTempFilter({ cName: '', pName: '' });
        setPage(0)
    }

    return (
        <div >
            <Loader />
            <div className={classes.addBtn}>
                <Filter reset={resetAllData} filter={tempFilter} setFilter={setTempFilter} />
            </div>
            <div>
                {roleBasePolicy(user?.role) && <Button startIcon={<Add />} className={classes.actionButton} variant="contained" color="primary" onClick={() => setOpen(!open)}>Add New materials</Button>}
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
            {open && <ProductionAction
                selectedData={editData}
                readOnly={readOnly}
                onClose={onClose}
                successAction={getProductionList}
                title={readOnly ? 'View Production details' : editData.id ? 'Edit Production detail' : 'Add New Production detail'}
            />}
        </div>

    );
};

export default ManufacturingList;
