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
import PeiChart from '../../../../common/report-components/PeiChart';
import PurchaseReportTable from '../../../../common/report-components/PurchaseReportTable';
import SingleBarChart from '../../../../common/report-components/SingleBarChart';
import { PURCHASE_RETURN_REPORT } from '../../../../config/api-urls';
import { useLoader } from '../../../../hooks/useLoader';
import { showMessage } from '../../../../utils/message';
import { sendGetRequest } from '../../../../utils/network';

const PurchaseReturnReport = ({ formsData }) => {
    const [{ start, stop }, Loader] = useLoader();
    const [rows, setRows] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [hide, setHide] = useState(false);
    const pdfRef = useRef();
    const user = useSelector((state) => state.user);

    useEffect(() => {
        fetchAllData();
    }, [formsData]);

    const fetchAllData = () => {
        start();
        sendGetRequest(`${PURCHASE_RETURN_REPORT}?from=${formsData?.from}&to=${formsData?.to}&pId=${formsData?.product ? formsData?.product?.id : ""}&sId=${formsData?.supplier ? formsData.supplier.id : ""}`, user.token)
            .then((_res) => {
                if (_res.status === 200) {
                    setRows(_res.data);
                } else {
                    showMessage("error", "Something went wrong while loading purchase return details");
                }
            }).catch(err => {
                console.log("err", err)
                showMessage("error", "Something went wrong while loading purchase return details");
            }).finally(() => stop())
    }

    const getValues = () => {
        let reportBy;
        if (formsData && formsData.product && !formsData.supplier) {
            reportBy = " Purchase Return Report by Product : " + formsData.product.name
        } else if (formsData && formsData.supplier && !formsData.product) {
            reportBy = " Purchase ReturnReport by Supplier : " + formsData.supplier.name
        } else if (formsData && (formsData.product && formsData.supplier)) {
            reportBy = " Purchase ReturnReport by Product : " + formsData.product.name + " and " + " Supplier : " + formsData.supplier.name
        }

        else {
            reportBy = 'Overview All Purchase return Reports'
        }
        return reportBy
    }


    const exportToExcel = async () => {
        if (!rows?.rows?.length) {
            alert("No data available to export!");
            return;
        }
        // Create a new Workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Purchase Return Report");

        // 🎨 Define Styles
        const titleStyle = {
            font: { bold: true, size: 16, color: { argb: "FFFFFF" } },
            alignment: { horizontal: "center", vertical: "middle" },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } }
        };

        const headerStyle = {
            font: { bold: true, color: { argb: "FFFFFF" } },
            alignment: { horizontal: "center", vertical: "middle" },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } }
        };

        const totalStyle = {
            font: { bold: true },
            alignment: { horizontal: "center" },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "D9EAD3" } }
        };

        // 🎯 Add Title (Merged)
        worksheet.mergeCells("A1:E1"); // Merge first row for title
        worksheet.getCell("A1").value = getValues();
        const titleCell = worksheet.getCell("A1");
        titleCell.font = titleStyle.font;
        titleCell.alignment = titleStyle.alignment;
        titleCell.fill = titleStyle.fill;

        // 🎯 Column Headers
        const headers = ["Date", "Supplier Name", "Product Name", "Qty", "Price"];
        worksheet.addRow([]); // Add empty row for spacing
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
            cell.font = headerStyle.font;
            cell.alignment = headerStyle.alignment;
            cell.fill = headerStyle.fill;
        });

        // 🎯 Define Column Widths & Alignment
        worksheet.columns = [
            { key: "date", width: 15, alignment: { horizontal: "left" } },
            { key: "Supplier", width: 25, alignment: { horizontal: "left" } },
            { key: "product", width: 20, alignment: { horizontal: "left" } },
            { key: "qty", width: 10, alignment: { horizontal: "center" }, numFmt: 0 },
            { key: "price", width: 15, alignment: { horizontal: "center" }, numFmt: "0.00" }
        ];

        // 🎯 Add Data Rows
        rows.rows.forEach(row => {
            const rowData = worksheet.addRow({
                date: row.date,
                Supplier: row.supplier.name,
                product: row.product.name,
                qty: Number(row.qty),
                price: Number(row.price)
            });

            rowData.eachCell((cell, colNumber) => {
                if (colNumber <= 3) {
                    cell.alignment = { horizontal: "left" };
                } else {
                    cell.alignment = { horizontal: "center" };
                }
            });
        });

        worksheet.addRow([]);
        const lastRow = worksheet.rowCount;

        const totalRow = worksheet.addRow([
            "Total", "", "",
            { formula: `SUM(D3:D${lastRow - 1})` },
            { formula: `SUM(E3:E${lastRow - 1})` }
        ]);

        totalRow.eachCell((cell) => {
            cell.font = totalStyle.font;
            cell.alignment = totalStyle.alignment;
            cell.fill = totalStyle.fill;
        });

        // 🎯 Save Excel File
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "Purchase-return-report.xlsx");

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
            pdf.save('Purchase-return-report.pdf')
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
                <PurchaseReportTable data={rows} formsData={formsData} hidden={hide} hiddenAction={setHide} onSuccess={fetchAllData} />
            </Grid>
            <Grid item sm={12}>
                <SingleBarChart title=" Report by date" filteredData={rows.rows} />
            </Grid>
            <Grid item xs={12} >
                <PeiChart title=" Report by product " data={rows.rows} />
            </Grid>
        </Grid>
    </>
    )
}

export default PurchaseReturnReport