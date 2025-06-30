import { IconButton, Paper } from '@material-ui/core';
import { TrendingUp } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import Refresh from '@mui/icons-material/AutorenewOutlined';
import PrintIcon from '@mui/icons-material/LocalPrintshopOutlined';
import {
  MenuItem, Pagination,
  Select,
  Skeleton,
  Table, TableBody, TableCell, TableContainer, TableFooter, TableHead,
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
import FinishGoodExcelReport from './excel-reports/FinishGoodExcelReport';
import { exportPurchaseStock } from './excel-reports/PurchaseExcelReport';
import SalesFilter from './Filter';
import ShowHistoryDetails from './history/ShowHistoryDetails';

const useStyles = makeStyles(() => ({
  root: {
    padding: 4,
  },
  tableWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    background: '#fff',
  },
  tableHead: {
    backgroundColor: '#f5f5f5',
  },
  headerCell: {
    fontWeight: 600,
  },
  productImg: {
    width: 30,
    height: 30,
    marginRight: 8,
    borderRadius: 4,
  },
  productNameCell: {
    display: 'flex',
    alignItems: 'center',
  },
  header: {
    padding: 8,
    margin: 16,
    display: 'flex',
    justifyContent: 'space-between',
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
const StockReport = () => {
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
  const [historyData, setHistoryData] = useState({});

  useEffect(() => {
    fetchPurchaseData();
  }, [filter, page, rowsPerPage]);

  const fetchPurchaseData = () => {
    start();
    setLoading(true);
    let url = filter.type !== "sales" ? `${STOCK_REPORT_BY_TYPE}?startDate=${filter?.selectedRange.start}&endDate=${filter?.selectedRange.end}&product=${filter?.product ? filter?.product : ""}&type=${filter.type}&per_page=${rowsPerPage}&page=${page}` :
      `${STOCK_REPORT}?startDate=${filter?.selectedRange.start}&endDate=${filter?.selectedRange.end}&pId=${filter?.product ? filter?.product : ""}&per_page=${rowsPerPage}&page=${page}`
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
    if (filter.type == "sales") {
      await FinishGoodExcelReport(rows, filter)
    } else {
      await exportPurchaseStock(rows, filter)
    }
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
      reportBy = "Purchase Stock Report by Product : " + filter.product
    } else if (filter && !filter.product && filter.type == "purchase") {
      reportBy = "Purchase Stock Report"
    } else if (filter && filter.product && filter.type !== "purchase") {
      reportBy = "Finished Good Stock Report by Product : " + filter.product
    } else if (filter && !filter.product && filter.type !== "purchase") {
      reportBy = "Finished Good Stock Report"
    }

    else {
      reportBy = 'Overview All Stock Report'
    }
    return reportBy
  }

  const historyShowByType = (row) => {
    const supId = row?.supplier ? row.supplier?.id : 0;
    const batchNo = filter.type == "sales" ? row.batchNo : 0;
    setHistoryData({ title: row.product.name, id: row.product.id, type: filter.type, supId, batchNo });
  }
  const onClose = () => {
    setHistoryData({});
  }

  return (
    <div>
      <div style={{ margin: '20px 0px' }}>
        <Paper style={{ padding: '20px', position: 'relative' }}>
          <SalesFilter applyFilter={applyFilter} reset={reset} />
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
                    <b>{filter.type == "purchase" ? "Purchase " : "Finished Good"} Stock Report </b>
                  }
                </Typography>
                {!printItemHidden && (
                  <div>
                    <Tooltip title="Refresh" placement="top">
                      <IconButton onClick={() => fetchPurchaseData()}>
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
              {filter.type == "purchase" ?
                <Table >
                  <TableHead className={classes.tableHead}>
                    <TableRow>
                      <TableCell>History</TableCell>
                      <TableCell>Purchase date</TableCell>
                      <TableCell>Purchase expiry date</TableCell>
                      <TableCell>Invoice No.</TableCell>
                      <TableCell>Batch No.</TableCell>
                      <TableCell>Supplier Name</TableCell>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Purchase Qty</TableCell>
                      <TableCell>Stock Qty</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>Price</TableCell>
                      {/* <TableCell style={{ textAlign: 'center' }}>Stock qty purchase rate</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 10 }).map((_, idx) => (
                        <TableRow key={idx}>
                          {[...Array(10)].map((_, cellIdx) => (
                            <TableCell key={cellIdx}>
                              <Skeleton variant="text" width="80%" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      rows && rows.length != 0 ? rows.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell><TrendingUp style={{ color: 'green', cursor: 'pointer' }} onClick={() => historyShowByType(row)} /></TableCell>
                          <TableCell>{row.purchaseDate}</TableCell>
                          <TableCell>{row.purchaseExpiryDate}</TableCell>
                          <TableCell>{row.invoiceNo}</TableCell>
                          <TableCell>{row.batch}</TableCell>
                          <TableCell>{row.supplier?.name}</TableCell>
                          <TableCell>{row.product?.name}</TableCell>
                          <TableCell>{row.purchaseQty}</TableCell>
                          <TableCell>{row.stockQty}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>₹{row.purchaseAmount}</TableCell>
                          {/* <TableCell style={{ textAlign: 'center' }}>₹{Number(row.stockQty) * Number(row.purchaseAmount)}</TableCell> */}
                        </TableRow>
                      )) : (
                        <TableRow >
                          <TableCell style={{ textAlign: 'center' }} colSpan={10}>No data found</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                  <TableFooter className={classes.tableHead}>
                    <TableRow>
                      <TableCell align="right" style={{ fontSize: 16 }}><strong>Total:</strong></TableCell>
                      <TableCell colSpan={6}></TableCell>
                      <TableCell style={{ fontSize: 16 }}><strong>{rows?.reduce((acc, row) => acc + Number(row.purchaseQty), 0) || 0}</strong></TableCell>
                      <TableCell colSpan={2} style={{ fontSize: 16 }}><strong>{rows?.reduce((acc, row) => acc + Number(row.stockQty), 0) || 0}</strong></TableCell>
                      {/* <TableCell style={{ fontSize: 16, textAlign: 'center' }}><strong>₹{rows?.reduce((acc, row) => acc + Number(row.stockQty) * Number(row.purchaseAmount), 0) || 0}</strong></TableCell> */}
                    </TableRow>
                  </TableFooter>
                </Table>
                :
                <Table>
                  <TableHead className={classes.tableHead}>
                    <TableRow>
                      <TableCell>History</TableCell>
                      <TableCell>Manufacturing Date</TableCell>
                      <TableCell>Batch No</TableCell>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Operator Name</TableCell>
                      <TableCell>Manufacturing Qty</TableCell>
                      <TableCell>Total Sales Qty</TableCell>
                      <TableCell>Return Sales Qty</TableCell>
                      <TableCell>Total Stock Qty</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>Sales Price</TableCell>
                      {/* <TableCell style={{ textAlign: 'center' }}>Total Sales</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 10 }).map((_, idx) => (
                        <TableRow key={idx}>
                          {[...Array(10)].map((_, cellIdx) => (
                            <TableCell key={cellIdx}>
                              <Skeleton variant="text" width="80%" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      rows && rows.length != 0 ? rows.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell><TrendingUp style={{ color: 'green', cursor: 'pointer' }} onClick={() => historyShowByType(row)} /></TableCell>
                          <TableCell>{row.manufacturingDate}</TableCell>
                          <TableCell>{row.batchNo}</TableCell>
                          <TableCell>{row.product?.name}</TableCell>
                          <TableCell>{row.operatorName}</TableCell>
                          <TableCell>{row.manufacturingQty}</TableCell>
                          <TableCell>{row.salesQty}</TableCell>
                          <TableCell>{row.returnQty}</TableCell>
                          <TableCell>{row.stockQty}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>₹{row.salesPrice}</TableCell>
                          {/* <TableCell style={{ textAlign: 'center' }}>₹{Number(row.stockQty) * Number(row.salesPrice)}</TableCell> */}
                        </TableRow>
                      )) : (
                        <TableRow >
                          <TableCell style={{ textAlign: 'center' }} colSpan={8}>No data found</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                  <TableFooter className={classes.tableHead}>
                    <TableRow>
                      <TableCell align="right" style={{ fontSize: 16 }}><strong>Total:</strong></TableCell>
                      <TableCell colSpan={5} ></TableCell>
                      <TableCell style={{ fontSize: 16 }}><strong>{rows?.reduce((acc, row) => acc + Number(row.manufacturingQty), 0) || 0}</strong></TableCell>
                      <TableCell style={{ fontSize: 16 }}><strong>{rows?.reduce((acc, row) => acc + Number(row.salesQty), 0) || 0}</strong></TableCell>
                      <TableCell colSpan={2} style={{ fontSize: 16 }}><strong>{rows?.reduce((acc, row) => acc + Number(row.stockQty), 0) || 0}</strong></TableCell>
                      {/* <TableCell style={{ fontSize: 16, textAlign: 'center' }}><strong>₹{rows?.reduce((acc, row) => acc + Number(row.stockQty) * Number(row.salesPrice), 0) || 0}</strong></TableCell> */}
                    </TableRow>
                  </TableFooter>
                </Table>
              }
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
        {Object.keys(historyData).length ? <ShowHistoryDetails
          title={historyData.title}
          open={true}
          maxWidth={'xl'}
          onClose={onClose}
          id={historyData.id}
          type={historyData.type}
          supId={historyData.supId}
          batchNo={historyData.batchNo}
        /> : ""}
      </div>
    </div>
  )
}

export default StockReport
