import { IconButton, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Refresh from '@mui/icons-material/AutorenewOutlined';
import PrintIcon from '@mui/icons-material/LocalPrintshopOutlined';
import {
    MenuItem, Pagination,
    Select,
    Table, TableBody, TableCell, TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import { format, subMonths } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { STOCK_REPORT, STOCK_REPORT_BY_TYPE } from '../../../../config/api-urls';
import { useLoader } from '../../../../hooks/useLoader';
import { showMessage } from '../../../../utils/message';
import { sendGetRequest } from '../../../../utils/network';
// import FinishGoodExcelReport from './excel-reports/FinishGoodExcelReport';
// import { exportPurchaseStock } from './excel-reports/PurchaseExcelReport';
import SalesFilter from '../stock-report/Filter';
import FifoExcelReport from './FifoExcelReport';

const useStyles = makeStyles(() => ({
    root: { padding: 4 },
    tableWrapper: {
        borderRadius: 8,
        overflow: 'hidden',
        background: '#fff',
    },
    tableHeader: {
        background: "#d8c9ae54"
    },
    header: {
        display: "flex",
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    headerCellStyle: {
        padding: 8,
        borderRight: '3px solid #dac4c4',
        fontSize: "18px !important",
        fontWeight: 'bold !important',
        backgroundColor: '#f0f0f0',
        textAlign: 'center !important'
    },
    headerNoRightBorder: {
        padding: '6px',
        borderLeft: '3px solid #dac4c4',
        borderRight: 'none',
        fontSize: "18px !important",
        fontWeight: 'bold !important',
        backgroundColor: '#f0f0f0',
        textAlign: 'center !important'
    },

    subHeader: {
        fontSize: '14px !important',
        fontWeight: 'bold',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ccc',
        textAlign: 'center !important'
    },
    subHeaderRightBorder: {
        fontSize: '14px !important',
        fontWeight: 'bold',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ccc',
        textAlign: 'center !important',
        borderRight: '3px solid #dac4c4',
    },
    cellBorderStyle: {
        border: '1px solid #ccc',
        fontSize: '12px !important',
        textAlign: 'center !important'
    },
    cellRightBorderStyle: {
        border: '1px solid #ccc',
        fontSize: '12px !important',
        textAlign: 'center !important',
        borderRight: '3px solid #dac4c4',
    },

    rowStyle: {
        borderBottom: '3px solid #dac4c4',
    },

    evenRow: {
        backgroundColor: '#fdfdfd',
    },
    oddRow: {
        backgroundColor: '#f5f5f5',
    },

    tableHead: {
        backgroundColor: '#d8c9ae54',
        padding: 8,
    },
    footer: {
        padding: 8,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 16,
    },
}));


const rowsPerPageOptions = [10, 20, 30, 50, 100];
const FifoReport = () => {

    const printRef = React.useRef();

    const classes = useStyles();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filter, setFilter] = useState({
        selectedRange: {
            start: format(subMonths(new Date(), 3), 'yyyy-MM-dd'),
            end: format(new Date(), 'yyyy-MM-dd')
        }, product: '', type: 'purchase'
    });
    const [loading, setLoading] = useState(true);
    const [{ start, stop }, Loader] = useLoader();
    const [rows, setRows] = useState([]);
    const [printItemHidden, setPrintItemHidden] = useState(false);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        fetchFifoData();
    }, [filter, page, rowsPerPage]);

    const fetchFifoData = () => {
        start();
        setLoading(true);
        let url = `${STOCK_REPORT_BY_TYPE}?startDate=${filter?.selectedRange.start}&endDate=${filter?.selectedRange.end}&pId=${filter?.product ? filter?.product : ""}&per_page=${rowsPerPage}&page=${page}`
        sendGetRequest(url, user.token)
            .then((_res) => {
                if (_res.status === 200) {
                    setRows(_res.data.rows);
                    setTotalRecords(_res.data.total);
                } else {
                    showMessage("error", `Something went wrong while loading ${filter.type} stock details`);
                }
            }).catch(err => {
                console.log("err", err)
                showMessage("error", `Something went wrong while loading ${filter.type} stock details`);
            }).finally(() => setLoading(false));
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(e.target.value);
        setPage(1);
    };

    const applyFilter = (selectedRange, type, product) => {
        setFilter({ selectedRange, type, product });
        setPage(1);
    }
    const reset = () => {
        setFilter({ ...filter, selectedRange: { start: format(subMonths(new Date(), 3), 'yyyy-MM-dd'), end: format(new Date(), 'yyyy-MM-dd') }, product: '', type: 'purchase' });
        setPage(1)
    }

    const exportToExcel = async () => {
        await FifoExcelReport(rows, filter)
    }

    const handlePrintAction = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    const handlePrint = () => {
        setPrintItemHidden(true);
        setTimeout(() => {
            handlePrintAction();
            setPrintItemHidden(false);
        }, 300);
    };

    const getValues = (filter) => {
        let reportBy;
        if (filter && filter.product && filter.type == "purchase") {
            reportBy = "FIFO Stock Report by Product : " + filter.product
        } else if (filter && !filter.product && filter.type == "purchase") {
            reportBy = "FIFO Stock Report"
        }

        else {
            reportBy = 'Overview All FIFO Stock Report'
        }
        return reportBy
    }

    const calculateAmount = (qty, rate) => qty * rate;

    return (
        <div>
            <div style={{ margin: '20px 0px' }}>
                <Paper style={{ padding: '20px', position: 'relative' }}>
                    <SalesFilter applyFilter={applyFilter} reset={reset} isDisabled={true} />
                </Paper>
            </div>
            <div style={{ margin: '20px 0px' }}>
                <div style={{ position: 'relative' }}>
                    <div className={classes.root} ref={printRef}>
                        <TableContainer component={Paper} className={classes.tableWrapper}>
                            <div className={classes.header}>
                                <Typography variant="h6" gutterBottom>
                                    {printItemHidden ?
                                        <b> {getValues(filter)}</b>
                                        :
                                        <b>FIFO Stock Report </b>
                                    }
                                </Typography>
                                {!printItemHidden && (
                                    <div>
                                        <Tooltip title="Refresh" placement="top">
                                            <IconButton onClick={() => fetchFifoData()}>
                                                <Refresh />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Excel Report in progress" placement="top">
                                            <IconButton onClick={exportToExcel}>
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1.2em" height="1.2em" viewBox="0 0 48 48">
                                                    <path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
                                                </svg>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Print" placement="top">
                                            <IconButton onClick={handlePrint}>
                                                <PrintIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                )}
                            </div>
                            <Table >
                                {/* Section Headers */}
                                <TableHead className={classes.tableHead}>
                                    <TableRow >
                                        <TableCell align="center" colSpan={9} className={classes.headerCellStyle}>
                                            Purchase
                                        </TableCell>
                                        <TableCell align="center" colSpan={3} className={classes.headerCellStyle}>
                                            Production
                                        </TableCell>
                                        <TableCell align="center" colSpan={3} className={classes.headerNoRightBorder}>
                                            Inventory
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableHead>
                                    <TableRow>
                                        {/* Purchase */}
                                        <TableCell className={classes.subHeader} fontSize="12px">Purchase Date</TableCell>
                                        <TableCell className={classes.subHeader} >Expiry Date</TableCell>
                                        <TableCell className={classes.subHeader} >Product Name</TableCell>
                                        <TableCell className={classes.subHeader} >Supplier</TableCell>
                                        <TableCell className={classes.subHeader} >Batch No</TableCell>
                                        <TableCell className={classes.subHeader} >Purchase Qty</TableCell>
                                        <TableCell className={classes.subHeader} >Return Qty</TableCell>
                                        <TableCell className={classes.subHeader} >Rate</TableCell>
                                        <TableCell className={classes.subHeaderRightBorder} >Purchase  - Amt</TableCell>
                                        {/* Production */}
                                        <TableCell className={classes.subHeader}>Production Date</TableCell>
                                        <TableCell className={classes.subHeader}>Product Name</TableCell>
                                        <TableCell className={classes.subHeaderRightBorder}>Use Qty</TableCell>
                                        {/* Inventory */}
                                        <TableCell className={classes.subHeader}>AVL Qty</TableCell>
                                        <TableCell className={classes.subHeader}>Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                {/* Table Body */}
                                <TableBody>
                                    {rows && rows.map((item, index) => {
                                        const amount = calculateAmount(item.stockQty, item.purchaseAmount);
                                        const prodLength = item.usages.length;
                                        // If no production data, render a single row with empty production cells
                                        if (prodLength === 0) {
                                            return (
                                                <TableRow key={`no-prod-${index}`} className={`${index % 2 === 0 ? classes.evenRow : classes.oddRow} ${classes.rowStyle}`}>
                                                    <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.purchaseDate}</TableCell>
                                                    <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.purchaseExpiryDate}</TableCell>
                                                    <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.product.name}</TableCell>
                                                    <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.supplier.name}</TableCell>
                                                    <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.batch}</TableCell>
                                                    <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.purchaseQty}</TableCell>
                                                    <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.returnQty}</TableCell>
                                                    <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.purchaseAmount}</TableCell>
                                                    <TableCell rowSpan={prodLength} className={classes.cellRightBorderStyle}>{item.purchaseQty * item.purchaseAmount}</TableCell>

                                                    {/* Empty production cells */}
                                                    <TableCell className={classes.cellBorderStyle} align="center">--</TableCell>
                                                    <TableCell className={classes.cellBorderStyle} align="center">--</TableCell>
                                                    <TableCell className={classes.cellRightBorderStyle} align="center">--</TableCell>

                                                    {/* Inventory cells */}
                                                    <TableCell className={classes.cellBorderStyle}>{item.stockQty}</TableCell>
                                                    <TableCell className={classes.cellBorderStyle}>{amount}</TableCell>
                                                </TableRow>
                                            );
                                        }

                                        // If production data exists, render rows as usual
                                        return item.usages.map((pItem, pIndex) => {
                                            const isLastRow = pIndex === prodLength - 1;

                                            return (
                                                <TableRow
                                                    key={`${index}-${pIndex}`}
                                                    className={`${index % 2 === 0 ? classes.evenRow : classes.oddRow} ${isLastRow ? classes.rowStyle : ''}`}
                                                >
                                                    {pIndex === 0 && (
                                                        <>
                                                            <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.purchaseDate}</TableCell>
                                                            <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.purchaseExpiryDate}</TableCell>
                                                            <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.product.name}</TableCell>
                                                            <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.supplier.name}</TableCell>
                                                            <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.batch}</TableCell>
                                                            <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.purchaseQty}</TableCell>
                                                            <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.returnQty}</TableCell>
                                                            <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.purchaseAmount}</TableCell>
                                                            <TableCell rowSpan={prodLength} className={classes.cellRightBorderStyle}>{item.purchaseQty * item.purchaseAmount}</TableCell>
                                                        </>
                                                    )}

                                                    <TableCell className={classes.cellBorderStyle}>{pItem.prodDate || '----'}</TableCell>
                                                    <TableCell className={classes.cellBorderStyle}>{pItem.usedProduct || '----'}</TableCell>
                                                    <TableCell className={classes.cellRightBorderStyle}>{pItem.useQty || '----'}</TableCell>

                                                    {pIndex === 0 && (
                                                        <>
                                                            <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{item.stockQty}</TableCell>
                                                            <TableCell rowSpan={prodLength} className={classes.cellBorderStyle}>{amount}</TableCell>
                                                        </>
                                                    )}
                                                </TableRow>
                                            );
                                        });
                                    })}
                                </TableBody>
                                <TableFooter className={classes.tableHead}>
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" style={{ fontSize: 16 }}><strong>Total:</strong></TableCell>
                                        <TableCell className={classes.cellBorderStyle} align="center" style={{ fontSize: 15 }}><strong>{rows?.reduce((acc, row) => acc + Number(row.purchaseQty), 0) || 0}</strong></TableCell>
                                        <TableCell className={classes.cellBorderStyle} colSpan={0} align="center" style={{ fontSize: 15 }}><strong>{rows?.reduce((acc, row) => acc + Number(row.returnQty), 0) || 0}</strong></TableCell>
                                        <TableCell className={classes.cellBorderStyle} colSpan={0} align="center" style={{ fontSize: 15 }}><strong>₹{rows?.reduce((acc, row) => acc + Number(row.purchaseAmount), 0) || 0}</strong></TableCell>
                                        <TableCell className={classes.cellBorderStyle} colSpan={0} align="center" style={{ fontSize: 15 }}><strong>₹{rows?.reduce((acc, row) => acc + Number(row.purchaseQty) * Number(row.purchaseAmount), 0) || 0}</strong></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell className={classes.cellBorderStyle} align="center" style={{ fontSize: 15 }}>
                                            <strong>
                                                {
                                                    rows
                                                        .flatMap(item => item.usages || [])
                                                        .reduce((acc, row) => acc + Number(row.useQty || 0), 0)
                                                }
                                            </strong>
                                        </TableCell>
                                        <TableCell className={classes.cellBorderStyle} align="center" style={{ fontSize: 15 }}><strong>{rows?.reduce((acc, row) => acc + Number(row.stockQty), 0) || 0}</strong></TableCell>
                                        <TableCell className={classes.cellBorderStyle} align="center" style={{ fontSize: 15, textAlign: 'center !important' }}><strong>₹{rows?.reduce((acc, row) => acc + Number(row.stockQty) * Number(row.purchaseAmount), 0) || 0}</strong></TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>

                            {!printItemHidden && <div className={classes.footer}>
                                <div>
                                    <Typography variant="body2" component="span">Rows per page:</Typography>{' '}
                                    <Select
                                        value={rowsPerPage}
                                        onChange={handleRowsPerPageChange}
                                        size="small"
                                        style={{ marginLeft: 8 }}
                                    >
                                        {rowsPerPageOptions.map((opt) => (
                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                        ))}
                                    </Select>
                                </div>
                                <Pagination
                                    count={Math.ceil(totalRecords / rowsPerPage)}
                                    page={page}
                                    onChange={handleChangePage}
                                    variant="outlined"
                                    shape="rounded"
                                    color="primary"
                                />
                            </div>}
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FifoReport
