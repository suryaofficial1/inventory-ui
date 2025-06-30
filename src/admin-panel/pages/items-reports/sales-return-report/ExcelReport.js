
import ExcelJS from "exceljs";
import { showMessage } from "../../../../utils/message";
import { saveAs } from "file-saver";


const getValues = (formsData) => {
    let reportBy;
    if (formsData && formsData.product && !formsData.customer) {
        reportBy = " Sales return Report by Product : " + formsData.product.name
    } else if (formsData && formsData.customer && !formsData.product) {
        reportBy = " Sales return Report by Customer : " + formsData.customer.name
    } else if (formsData && (formsData.product && formsData.customer)) {
        reportBy = " Sales return Report by Product : " + formsData.product.name + " and " + " Customer : " + formsData.customer.name
    }

    else {
        reportBy = 'Overview All Sales return Reports'
    }
    return reportBy
}
const ExcelReportAction = async (salesData, formsData) => {
    if (!salesData?.length) {
        showMessage("error", "No data available to export!");
        return;
    }
    // Create a new Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales return Report");

    // 🎨 Define Styles
    const titleStyle = {
        font: { bold: true, size: 18, color: { argb: "FFFFFF" } },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } }
    };

    const headerStyle = {
        font: { bold: true, size: 14, color: { argb: "FFFFFF" } },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } }
    };

    const totalStyle = {
        font: { bold: true },
        alignment: { horizontal: "center" },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "D9EAD3" } }
    };

    // 🎯 Add Title (Merged)
    worksheet.mergeCells("A1:G1"); // Merge first row for title
    worksheet.getCell("A1").value = getValues(formsData);
    const titleCell = worksheet.getCell("A1");
    titleCell.font = titleStyle.font;
    titleCell.alignment = titleStyle.alignment;
    titleCell.fill = titleStyle.fill;

    // 🎯 Column Headers
    const headers = ["Date", "Sales Name", "Customer Name", "Product Name", "Qty", "Return Sales Price", "Total Return Sales"];
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
        { key: "salesName", width: 15, alignment: { horizontal: "left" } },
        { key: "customer", width: 30, alignment: { horizontal: "left" } },
        { key: "product", width: 30, alignment: { horizontal: "left" } },
        { key: "qty", width: 10, alignment: { horizontal: "center" }, numFmt: 0 },
        { key: "salesReturnPrice", width: 20, alignment: { horizontal: "center" }, numFmt: "0.00" },
        { key: "totalSales", width: 30, alignment: { horizontal: "center" }, numFmt: "0.00" }
    ];

    // 🎯 Add Data Rows
    salesData.forEach(row => {
        const rowData = worksheet.addRow({
            date: row.salesDate,
            salesName: row.salesName,
            customer: row.customer.name,
            product: row.product.name,
            qty: Number(row.qty),
            salesReturnPrice: Number(row.salesReturnPrice),
            totalSales: Number(row.qty) * Number(row.salesReturnPrice)
        });

        rowData.eachCell((cell, colNumber) => {
            if (colNumber <= 4) {
                cell.alignment = { horizontal: "left" };
            } else {
                cell.alignment = { horizontal: "center" };
            }
        });
    });

    worksheet.addRow([]);
    const lastRow = worksheet.rowCount;

    // const totalRow = worksheet.addRow([
    //     "Total", "", "",
    //     { formula: `SUM(D3:D${lastRow - 1})` },
    //     "",
    //     { formula: `SUM(F3:F${lastRow - 1})` }
    // ]);

    const totalRow = worksheet.addRow([
        "Total", "", "","",
        { formula: `SUM(E3:E${lastRow - 1})`, numFmt: '"\u20B9" #,##0.00' },
        "",
        { formula: `SUM(G3:G${lastRow - 1})`, numFmt: '"\u20B9" #,##0.00' }
    ]);

    totalRow.eachCell((cell) => {
        cell.font = totalStyle.font;
        cell.alignment = totalStyle.alignment;
        cell.fill = totalStyle.fill;
    });

    // 🎯 Save Excel File
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Sales-return-report.xlsx");
}

export default ExcelReportAction;

