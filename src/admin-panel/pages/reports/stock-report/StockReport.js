import { Grid } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Button, List, ListItem, ListItemIcon, ListItemText, Popover, Typography } from "@mui/material";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import StockReportTable from '../../../../common/report-components/StockReportTable';
import { STOCK_REPORT } from '../../../../config/api-urls';
import { useLoader } from '../../../../hooks/useLoader';
import { showMessage } from '../../../../utils/message';
import { sendGetRequest } from '../../../../utils/network';
import ProductionSingleBar from '../../../../common/report-components/ProductionSingleBar';

const StockReport = ({ formsData }) => {
    const [{ start, stop }, Loader] = useLoader();
    const [stockData, setStockData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [hide, setHide] = useState(false);
    const pdfRef = useRef();
    const user = useSelector((state) => state.user);

    useEffect(() => {
        fetchStockReports();
    }, [formsData]);

    const fetchStockReports = () => {
        start();
        sendGetRequest(`${STOCK_REPORT}?from=${formsData?.from}&to=${formsData?.to}&pId=${formsData?.product ? formsData?.product?.id : ""}`, user.token)
            .then((_res) => {
                if (_res.status === 200) {
                    setStockData(_res.data);
                } else {
                    showMessage("error", "Something went wrong while loading stock details");
                }
            }).catch(err => {
                console.log("err", err)
                showMessage("error", "Something went wrong while loading stock details");
            }).finally(() => stop())
    }

    const getValues = () => {
        let reportBy;
        if (formsData && formsData.product) {
            reportBy = " Stock Report by Product : " + formsData.product.name
        }
        else {
            reportBy = 'Overview All Stock Reports'
        }
        return reportBy
    }

    // const exportToExcel = async () => {
    //     if (!stockData?.rows?.length) {
    //         alert("No data available to export!");
    //         return;
    //     }

    //     const workbook = new ExcelJS.Workbook();
    //     const worksheet = workbook.addWorksheet("Stock Report");

    //     // ========== Title ==========
    //     worksheet.mergeCells("A1:L1");
    //     const titleCell = worksheet.getCell("A1");
    //     titleCell.value = "Overview All Stock Reports";
    //     titleCell.font = { bold: true, size: 16, color: { argb: "000000" } };
    //     titleCell.alignment = { horizontal: "center", vertical: "middle" };
    //     titleCell.fill = {
    //         type: "pattern",
    //         pattern: "solid",
    //         fgColor: { argb: "F4A300" },
    //     };
    //     worksheet.getRow(1).height = 40;

    //     // ========== Header Row 2: Group Headers ==========
    //     worksheet.mergeCells("A3:A4"); // Date
    //     worksheet.mergeCells("B3:B4"); // Product Name
    //     worksheet.mergeCells("C3:F3"); // Purchase
    //     worksheet.mergeCells("G3:I3"); // Production
    //     worksheet.mergeCells("J3:L3"); // Inventory

    //     // Assign group titles after merge
    //     worksheet.getCell("A3").value = "Date";
    //     worksheet.getCell("B3").value = "Product Name";
    //     worksheet.getCell("C3").value = "Purchase";
    //     worksheet.getCell("G3").value = "Production";
    //     worksheet.getCell("J3").value = "Inventory";

    //     ["A3", "B3", "C3", "G3", "J3"].forEach(cell => {
    //         const c = worksheet.getCell(cell);
    //         c.font = { bold: true, color: { argb: "FFFFFF" } };
    //         c.alignment = { horizontal: "center", vertical: "middle" };
    //         c.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    //         c.fill = {
    //             type: "pattern",
    //             pattern: "solid",
    //             fgColor: { argb: "4F81BD" }, // deep red
    //         };
    //     });
    //     worksheet.getRow(3).height = 30;


    //     // ========== Header Row 4: Sub-Headers ==========
    //     const headers = [
    //         "", "", "Quantity", "Batch No.", "Rate", "Amount",
    //         "Manufacturing Date", "Batch No.", "Quantity",
    //         "Reject Quantity", "Balance Quantity", "Amount"
    //     ];

    //     const headerRow = worksheet.getRow(4);
    //     headerRow.values = headers;
    //     headerRow.height = 30;

    //     headerRow.eachCell((cell, colNumber) => {
    //         if (colNumber > 2) {
    //             cell.font = { bold: true, color: { argb: "#545454" } };
    //             cell.alignment = { horizontal: "center", vertical: "middle" };
    //             cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    //             cell.fill = {
    //                 type: "pattern",
    //                 pattern: "solid",
    //                 fgColor: { argb: "FFFFFF" },
    //             };
    //         }
    //     });

    //     // ========== Set column widths ==========
    //     worksheet.columns = [
    //         { key: "purchaseDate", width: 15, style: { alignment: { horizontal: "center" } }, type: "date" },
    //         { key: "product", width: 20, style: { alignment: { horizontal: "center" } }, type: "string" },
    //         { key: "pQty", width: 10 },
    //         { key: "pBatchNo", width: 12 },
    //         { key: "pRate", width: 10 },
    //         { key: "purchaseAmount", width: 15 },
    //         { key: "mDate", width: 20 },
    //         { key: "prodBatchNo", width: 12 },
    //         { key: "mQty", width: 10 },
    //         { key: "rQty", width: 15 },
    //         { key: "balanceQty", width: 15 },
    //         { key: "inventoryAmount", width: 15 },
    //     ];

    //     // ========== Data Rows ==========
    //     let totalQty = 0;
    //     let totalPurchaseAmount = 0;
    //     let totalBalanceQty = 0;
    //     let totalInventoryAmount = 0;

    //     stockData.rows.forEach(row => {
    //         const purchaseAmount = Number(row.pRate) * Number(row.pQty);
    //         const inventoryAmount = Number(row.pRate) * Number(row.balanceQty);

    //         totalQty += Number(row.pQty);
    //         totalPurchaseAmount += purchaseAmount;
    //         totalBalanceQty += Number(row.balanceQty);
    //         totalInventoryAmount += inventoryAmount;

    //         const showDetailsRows = worksheet.addRow({
    //             purchaseDate: row.purchaseDate,
    //             product: row.product,
    //             pQty: Number(row.pQty),
    //             pBatchNo: row.pBatchNo,
    //             pRate: Number(row.pRate),
    //             purchaseAmount,
    //             mDate: row.mDate,
    //             prodBatchNo: row.pBatchNo,
    //             mQty: Number(row.mQty),
    //             rQty: Number(row.rQty),
    //             balanceQty: Number(row.balanceQty),
    //             inventoryAmount
    //         });
    //         showDetailsRows.eachCell(cell => {
    //             cell.alignment = { horizontal: "center", vertical: "middle" };
    //             cell.fill = {
    //                 type: "pattern",
    //                 pattern: "solid",
    //                 fgColor: { argb: "FFFFFF" }, // light green
    //             };
    //         });
    //     });

    //     const startRow = 5;
    //     const endRow = startRow + stockData.rows.length - 1;

    //     const totalRow = worksheet.addRow([
    //         "Total",
    //         "",
    //         { formula: `SUM(C${startRow}:C${endRow})` },
    //         "",
    //         "",
    //         { formula: `SUM(F${startRow}:F${endRow})` },
    //         "",
    //         "",
    //         "",
    //         "",
    //         { formula: `SUM(K${startRow}:K${endRow})` },
    //         { formula: `SUM(L${startRow}:L${endRow})` }
    //     ]);

    //     totalRow.eachCell(cell => {
    //         cell.font = { bold: true };
    //         cell.alignment = { horizontal: "center", vertical: "middle" };
    //         cell.fill = {
    //             type: "pattern",
    //             pattern: "solid",
    //             fgColor: { argb: "D9EAD3" }, // light green
    //         };
    //     });

    //     // ========== Export ==========
    //     const buffer = await workbook.xlsx.writeBuffer();
    //     const blob = new Blob([buffer], {
    //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //     });
    //     saveAs(blob, "Stock-Report.xlsx");
    // };
    const exportToExcel = async () => {
        if (!stockData?.rows?.length) {
            alert("No data available to export!");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Stock Report");

        // ========== Title ==========
        worksheet.mergeCells("A1:L1");
        const titleCell = worksheet.getCell("A1");
        titleCell.value = "Overview All Stock Reports";
        titleCell.font = { bold: true, size: 16, color: { argb: "000000" } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        titleCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F4A300" },
        };
        worksheet.getRow(1).height = 40;

        // ========== Header Row 2: Group Headers ==========
        worksheet.mergeCells("A3:A4");
        worksheet.mergeCells("B3:B4");
        worksheet.mergeCells("C3:F3");
        worksheet.mergeCells("G3:I3");
        worksheet.mergeCells("J3:L3");

        worksheet.getCell("A3").value = "Date";
        worksheet.getCell("B3").value = "Product Name";
        worksheet.getCell("C3").value = "Purchase";
        worksheet.getCell("G3").value = "Production";
        worksheet.getCell("J3").value = "Inventory";

        ["A3", "B3", "C3", "G3", "J3"].forEach(cell => {
            const c = worksheet.getCell(cell);
            c.font = { bold: true, color: { argb: "FFFFFF" } };
            c.alignment = { horizontal: "center", vertical: "middle" };
            c.border = {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" }
            };
            c.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "4F81BD" },
            };
        });
        worksheet.getRow(3).height = 30;

        // ========== Header Row 4: Sub-Headers ==========
        const headers = [
            "", "", "Quantity", "Batch No.", "Rate", "Amount",
            "Manufacturing Date", "Batch No.", "Quantity",
            "Reject Quantity", "Balance Quantity", "Amount"
        ];
        const headerRow = worksheet.getRow(4);
        headerRow.values = headers;
        headerRow.height = 30;

        headerRow.eachCell((cell, colNumber) => {
            if (colNumber > 2) {
                cell.font = { bold: true, color: { argb: "#545454" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                };
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFFFF" },
                };
            }
        });

        // ========== Column Widths ==========
        worksheet.columns = [
            { key: "purchaseDate", width: 15, style: { alignment: { horizontal: "center" } } },
            { key: "product", width: 20, style: { alignment: { horizontal: "center" } } },
            { key: "pQty", width: 10 },
            { key: "pBatchNo", width: 12 },
            { key: "pRate", width: 10 },
            { key: "purchaseAmount", width: 15 },
            { key: "mDate", width: 20 },
            { key: "prodBatchNo", width: 12 },
            { key: "mQty", width: 10 },
            { key: "rQty", width: 15 },
            { key: "balanceQty", width: 15 },
            { key: "inventoryAmount", width: 15 },
        ];

        // ========== Data Rows ==========
        let totalQty = 0;
        let totalPurchaseAmount = 0;
        let totalBalanceQty = 0;
        let totalInventoryAmount = 0;

        stockData.rows.forEach(row => {
            const purchaseAmount = Number(row.pRate) * Number(row.pQty);
            const inventoryAmount = Number(row.pRate) * Number(row.balanceQty);

            totalQty += Number(row.pQty);
            totalPurchaseAmount += purchaseAmount;
            totalBalanceQty += Number(row.balanceQty);
            totalInventoryAmount += inventoryAmount;

            const percentage = (Number(row.balanceQty) / Number(row.pQty)) * 100;

            let balanceColor = "FFFFFF"; // default
            if (percentage >= 70) {
                balanceColor = "C00000"; // High - red
            } else if (percentage >= 40 && percentage < 70) {
                balanceColor = "DBDF56"; // Average - yellow
            } else if (percentage <= 40) {
                balanceColor = "169545"; // Low - green
            }

            const showDetailsRows = worksheet.addRow({
                purchaseDate: row.purchaseDate,
                product: row.product,
                pQty: Number(row.pQty),
                pBatchNo: row.pBatchNo,
                pRate: Number(row.pRate),
                purchaseAmount,
                mDate: row.mDate,
                prodBatchNo: row.pBatchNo,
                mQty: Number(row.mQty),
                rQty: Number(row.rQty),
                balanceQty: Number(row.balanceQty),
                inventoryAmount
            });

            // Apply default styling
            showDetailsRows.eachCell(cell => {
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFFFF" },
                };
            });

            // Apply conditional fill to balanceQty (11th cell)
            const balanceCell = showDetailsRows.getCell(11);
            balanceCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: balanceColor },
            };
            balanceCell.font = { color: { argb: "FFFFFF" } };
        });

        // ========== Total Row ==========
        const startRow = 5;
        const endRow = startRow + stockData.rows.length - 1;

        const totalRow = worksheet.addRow([
            "Total",
            "",
            { formula: `SUM(C${startRow}:C${endRow})` },
            "",
            "",
            { formula: `SUM(F${startRow}:F${endRow})` },
            "",
            "",
            { formula: `SUM(I${startRow}:I${endRow})` },
            "",
            { formula: `SUM(K${startRow}:K${endRow})` },
            { formula: `SUM(L${startRow}:L${endRow})` }
        ]);

        totalRow.eachCell(cell => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "D9EAD3" },
            };
        });

        // ========== Export ==========
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "Stock-Report.xlsx");
    };


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const processPdfReportDownload = () => {
        setHide(true);
        setTimeout(() => {
            downloadReport();
        }, 1200)
    }

    const downloadReport = () => {
        const input = pdfRef.current
        html2canvas(input).then((convas) => {
            const imgData = convas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = convas.width;
            const imgHeight = convas.height;
            const ration = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ration) / 2;
            const imgY = 30;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ration, imgHeight * ration);
            pdf.save('Stock-report.pdf')
        })
        setHide(false);
    }

    return (<>
        <Loader />
        <Grid container spacing={1} >
            <Grid item sm={12}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: 10 }}>
                    <div>
                        <Typography variant='h5'>{getValues()}</Typography>
                    </div>
                    <div>
                        <Button startIcon={<CloudDownloadIcon />} variant="contained" color="primary" onClick={handleClick}>
                            Download Report
                        </Button>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <List component="nav" aria-label="main mailbox folders">
                                <ListItem button onClick={exportToExcel} style={{ cursor: "pointer" }}>
                                    <ListItemIcon>
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1.2em" height="1.2em" viewBox="0 0 48 48">
                                            <path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
                                        </svg>
                                    </ListItemIcon>
                                    <ListItemText primary="Excel" />
                                </ListItem>
                                <ListItem button onClick={processPdfReportDownload} style={{ cursor: "pointer" }}>
                                    <ListItemIcon>
                                        <PictureAsPdfIcon color="error" />
                                    </ListItemIcon>
                                    <ListItemText primary="PDF" />
                                </ListItem>
                            </List>
                        </Popover>
                    </div>
                </div>
            </Grid>
        </Grid>
        <Grid container spacing={1} ref={pdfRef}>
            <Grid item sm={12} >
                <StockReportTable data={stockData?.rows} formsData={formsData} hidden={hide} hiddenAction={setHide} onSuccess={fetchStockReports} />
            </Grid>
             {/* <Grid item sm={12}>
                 <ProductionSingleBar title={"Stock report by date"} filteredData={stockData.rows} />

            </Grid> */}
           {/* <Grid item xs={12} >
                <PeiChart title="Stock Report by product " data={stockData.rows} />
            </Grid> */}
        </Grid>
    </>
    )
}

export default StockReport