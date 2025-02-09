import { Button, Chip } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Refresh, Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ActionButton from '../../../../common/action-button/ActionButton';
import { DELETE_MATERIYAL, MATERIYAL_LIST } from '../../../../config/api-urls';
import { useLoader } from '../../../../hooks/useLoader';
import { roleBasePolicy } from '../../../../utils/Constent';
import { showMessage } from '../../../../utils/message';
import { sendDeleteRequest, sendGetRequest } from '../../../../utils/network';
import RowMaterialsAction from './RowMaterialsAction';

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

const RowMaterialsList = () => {
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
        getMaterialsList();
    }, [page, filter]);
    const getMaterialsList = () => {
        start()
        sendGetRequest(`${MATERIYAL_LIST}?page=${page + 1}&per_page=10`, "token")
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
        sendDeleteRequest(`${DELETE_MATERIYAL(row.id)}`, "token")
            .then(res => {
                if (res.status === 200) {
                    getMaterialsList();
                    showMessage('success', 'Material record deleted successfully');
                } else {
                    showMessage("error", 'Somthing went wrong on delete!')
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
            field: 'materials', headerName: 'Row Material', width: 150, resizable: false, sortable: false,
            renderCell: (params) => (
                params.row.materials ? <Chip label={JSON.parse(params.row.materials).join(', ')} /> : ""
            )
        },

        { field: 'mqty', headerName: 'Material Quantity', width: 110, resizable: true, sortable: false },
        { field: 'mPrice', headerName: 'Material Price', width: 110, resizable: true, sortable: false },
        { field: 'rqty', headerName: 'Rejection  Quantity', width: 110, resizable: true, sortable: false },
        { field: 'rPrice', headerName: 'Rejection  Price', width: 110, resizable: true, sortable: false },
        { field: 'lqty', headerName: 'Lumps Quantity', width: 110, resizable: true, sortable: false },
        { field: 'lPrice', headerName: 'Lumps Price', width: 110, resizable: true, sortable: false },
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
            {/* <div className={classes.addBtn}>
                <Filter reset={resetAllData} filter={tempFilter} setFilter={setTempFilter} />
            </div> */}
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

            {open && <RowMaterialsAction
                selectedData={editData}
                readOnly={readOnly}
                onClose={onClose}
                successAction={getMaterialsList}
                title={readOnly ? 'View materials details' : editData.id ? 'Edit materials detail' : 'Add New materials detail'}
            />}
        </div>
    );
};

export default RowMaterialsList;
