import { Box, Button, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import { Add, KeyboardArrowDown, KeyboardArrowUp, Refresh, Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import ActionButton from '../../../common/action-button/ActionButton';
import { DELETE_PRODUCTION, PRODUCTION_LIST } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { roleBasePolicy } from '../../../utils/Constent';
import { sendDeleteRequest, sendGetRequest } from '../../../utils/network';
import ProductionAction from './Action';
import Filter from './Filter';
import UsedMaterialList from './UsedMaterialList';

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
        sendGetRequest(`${PRODUCTION_LIST}?cName=${filter?.cName ? filter?.cName.name : ""}&pName=${filter?.pName ? filter?.pName.product : ""}&page=${page + 1}&per_page=10`, user.token)
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
                    getProductionList();
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
        { field: 'product', headerName: 'Product', width: 160, resizable: false, sortable: false },


        { field: 'unit', headerName: 'Unit', width: 110, resizable: true, sortable: false },
        { field: 'qty', headerName: 'Quantity', width: 110, resizable: true, sortable: false },

        { field: 'operatorName', headerName: 'Operator', width: 140, resizable: true, sortable: false },
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

            <EzyDataGrid
                autoHeight
                pagination
                rows={rows}
                columns={columns}
                extendedField={"materials"}
                page={page}
                pageSize={10}
                rowsPerPageOptions={[10, 20]}
                rowCount={(totalRecords) ? totalRecords : 100}
                paginationMode="server"
                onPageChange={(e, newPage) => setPage(newPage)}
                disableColumnMenu
                disableColumnFilter
            />

            {/* <DataGrid autoHeight pagination style={{ background: "#fff", width: "100%" }}
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
            /> */}
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

export default ManufacturingList



function Row(props) {
    const { open, onExpand, row, columns, heading, extendedField } = props;
    return (
        <>
            <TableRow key={row.id}>
                <TableCell width={30}>
                    <IconButton aria-label="view reporters" size="small" onClick={() => onExpand(row.id)}>
                        {open == row.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>

                {columns.map((item, i) => <TableCell key={i}>
                    {item.renderCell ? item.renderCell({ value: row[item.field], row }) : row[item.field]}
                </TableCell>)}
            </TableRow>
            {extendedField ?
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                        <Collapse in={open == row.id} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Used Materials
                                </Typography>
                                <UsedMaterialList list={row[extendedField]} />
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow> : ''}
        </>
    );
}

function EzyDataGrid({ columns, rows, rowsPerPageOptions, page, pageSize, rowCount, onPageChange, extendedColumns, extendedField }) {

    const [open, setOpen] = useState(-1)


    return <TableContainer component={Paper} style={{ width: "100%", minWidth: "100%" }} >
        <Table aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell width={30}></TableCell>
                    {columns.map((item, i) => <TableCell key={i} width={item.width || 100}>{item.headerName}</TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, index) => (
                    <Row key={index} row={row} columns={columns} open={open} onExpand={(_new) => setOpen((prev) => prev == _new ? -1 : _new)} extendedColumns={extendedColumns} extendedField={extendedField} />))}
            </TableBody>
        </Table>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>

            <TableFooter >
                <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    rowsPerPage={pageSize}
                    colSpan={4}
                    count={rowCount}
                    page={page}
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} out of ${rowCount}`}
                    onPageChange={onPageChange}
                />
            </TableFooter>
        </div>
    </TableContainer>
}