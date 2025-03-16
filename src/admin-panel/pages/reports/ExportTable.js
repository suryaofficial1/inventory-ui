import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Button, List, ListItem, ListItemIcon, ListItemText, Paper, Popover, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React from "react";

const ExportTable = ({ data, formsData }) => {

    const exportToExcel = async () => {
        if (!data?.rows?.length) {
            alert("No data available to export!");
            return;
        }

        // Create a new Workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sales Report");

        // 🎨 Define Styles
        const titleStyle = {
            font: { bold: true, size: 16, color: { argb: "FFFFFF" } },
            alignment: { horizontal: "center", vertical: "middle" },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } } // Blue BG
        };

        const headerStyle = {
            font: { bold: true, color: { argb: "FFFFFF" } },
            alignment: { horizontal: "center", vertical: "middle" },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } } // Blue BG
        };

        const totalStyle = {
            font: { bold: true },
            alignment: { horizontal: "center" },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "D9EAD3" } } // Light Green BG
        };

        // 🎯 Add Title (Merged)
        worksheet.mergeCells("A1:E1"); // Merge first row for title
        worksheet.getCell("A1").value = getValues(); // Get dynamic title
        const titleCell = worksheet.getCell("A1");
        titleCell.font = titleStyle.font;
        titleCell.alignment = titleStyle.alignment;
        titleCell.fill = titleStyle.fill;

        // 🎯 Column Headers
        const headers = ["Date", "Customer Name", "Product Name", "Qty", "Price"];
        worksheet.addRow([]); // Add empty row for spacing
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
            cell.font = headerStyle.font;
            cell.alignment = headerStyle.alignment;
            cell.fill = headerStyle.fill;
        });

        // 🎯 Define Column Widths & Alignment
        worksheet.columns = [
            { key: "date", width: 15, alignment: { horizontal: "left" } }, // Left Align
            { key: "customer", width: 25, alignment: { horizontal: "left" } }, // Left Align
            { key: "product", width: 20, alignment: { horizontal: "left" } }, // Left Align
            { key: "qty", width: 10, alignment: { horizontal: "center" }, numFmt: "0" }, // Center Align
            { key: "price", width: 15, alignment: { horizontal: "center" }, numFmt: "0.00" } // Center Align
        ];

        // 🎯 Add Data Rows
        data.rows.forEach(row => {
            const rowData = worksheet.addRow({
                date: row.date,
                customer: row.customer,
                product: row.product,
                qty: row.qty,
                price: row.price
            });

            rowData.eachCell((cell, colNumber) => {
                if (colNumber <= 3) { // Left align for Date, Customer, Product
                    cell.alignment = { horizontal: "left" };
                } else { // Center align for Qty, Price
                    cell.alignment = { horizontal: "center" };
                }
            });
        });

        // 🎯 Add Total Raw
        worksheet.addRow([]); // Add empty row for spacing
        const totalRow = worksheet.addRow(["Total", "", "", data.total.totalQty, data.total.totalPrice]);
        totalRow.eachCell((cell) => {
            cell.font = totalStyle.font;
            cell.alignment = totalStyle.alignment;
            cell.fill = totalStyle.fill;
        });

        // 🎯 Save Excel File
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "SalesReport.xlsx");
    };


    // ✅ Export to PDF
    // const exportToPDF = () => {
    //     const doc = new jsPDF();
    //     doc.text("Exported Data", 20, 10);

    //     const tableColumn = ["Date", "Customer Name", "Product Name", "Qty", "Price"];
    //     const tableRows = data?.rows?.map(row => [row.date, row.customer, row.product, row.qty, row.price]);

    //     doc.autoTable({
    //         head: [tableColumn],
    //         body: tableRows,
    //     });

    //     doc.save("ExportData.pdf");
    // };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const getValues = () => {
        let reportBy;
        if (formsData && formsData.product && !formsData.customer) {
            reportBy = " Sales Report by Product : " + formsData.product.name
        } else if (formsData && formsData.customer && !formsData.product) {
            reportBy = " Sales Report by Customer : " + formsData.customer.name
        } else if (formsData && (formsData.product && formsData.customer)) {
            reportBy = " Sales Report by Product : " + formsData.product.name + " and " + " Customer : " + formsData.customer.name
        }

        else {
            reportBy = 'Overview All Sales Reports'
        }
        return reportBy
    }

    return (
        <div>
            <TableContainer component={Paper}>
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
                                <ListItem disabled button style={{ cursor: "pointer", color: "gray" }}>
                                    <ListItemIcon>
                                        <PictureAsPdfIcon color="disabled" />
                                    </ListItemIcon>
                                    <ListItemText primary="PDF" />
                                </ListItem>
                            </List>
                        </Popover>
                    </div>
                </div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Price</TableCell>
                        </TableRow>
                    </TableHead>
                    {data?.rows?.length > 0 ? (
                        <>
                            <TableBody>
                                {data.rows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.customer}</TableCell>
                                        <TableCell>{row.product}</TableCell>
                                        <TableCell>{row.qty}</TableCell>
                                        <TableCell>{row.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3} align="right"><strong>Total:</strong></TableCell>
                                    <TableCell><strong>{data?.total?.totalQty || 0}</strong></TableCell>
                                    <TableCell><strong>{data?.total?.totalPrice || 0}</strong></TableCell>
                                </TableRow>
                            </TableFooter>
                        </>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={5} align="center"><strong>Sorry, Data not found!</strong></TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </TableContainer>
        </div>
    );
};

export default ExportTable;
