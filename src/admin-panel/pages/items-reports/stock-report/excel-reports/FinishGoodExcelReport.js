
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { showMessage } from "../../../../../utils/message";


const getValues = (formsData) => {
   let reportBy;
    if (formsData && formsData.product && formsData.type == "purchase") {
      reportBy = "Purchase Stock Report by Product : " + formsData.product
    } else if (formsData && !formsData.product && formsData.type == "purchase") {
      reportBy = "Purchase Stock Report"
    } else if (formsData && formsData.product && formsData.type !== "purchase") {
      reportBy = "Finished Good Stock Report by Product : " + formsData.product
    } else if (formsData && !formsData.product && formsData.type !== "purchase") {
      reportBy = "Finished Good Stock Report"
    }

    else {
      reportBy = 'Overview All Stock Report'
    }
    return reportBy
}
const FinishGoodExcelReport = async (data, formsData) => {
    if (!data?.length) {
        showMessage("error", "No data available to export!");
        return;
    }
    // Create a new Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Finished Good Stock Report");

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
    worksheet.mergeCells("A1:J1"); // Merge first row for title
    worksheet.getCell("A1").value = getValues(formsData);
    const titleCell = worksheet.getCell("A1");
    titleCell.font = titleStyle.font;
    titleCell.alignment = titleStyle.alignment;
    titleCell.fill = titleStyle.fill;

    // 🎯 Column Headers
    const headers = ["Manufacturing Date", "Batch No","Operator Name", "Product Name", "Qty", "Total Sales Qty", "Total return Qty", "Total Stock Qty", "Sales Amount", "Total Sales Amount"];
    worksheet.addRow([]); // Add empty row for spacing
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
        cell.font = headerStyle.font;
        cell.alignment = headerStyle.alignment;
        cell.fill = headerStyle.fill;
    });

    // 🎯 Define Column Widths & Alignment
    worksheet.columns = [
        { key: "manufacturingDate", width: 25, alignment: { horizontal: "left" } },
        { key: "batchNo", width: 20, alignment: { horizontal: "left" } },
        { key: "operatorName", width: 30, alignment: { horizontal: "left" } },
        { key: "product", width: 30, alignment: { horizontal: "left" } },
        { key: "manufacturingQty", width: 10, alignment: { horizontal: "center" }, numFmt: 0 },
        { key: "salesQty", width: 20, alignment: { horizontal: "center" }, numFmt: "0.00" },
        { key: "returnQty", width: 20, alignment: { horizontal: "center" }, numFmt: "0.00" },
        { key: "stockQty", width: 20, alignment: { horizontal: "center" }, numFmt: "0.00" },
        { key: "salesPrice", width: 30, alignment: { horizontal: "center" }, numFmt: "0.00" },
        { key: "totalSales", width: 35, alignment: { horizontal: "center" }, numFmt: "0.00" }
    ];

    // 🎯 Add Data Rows
    data.forEach(row => {
        const rowData = worksheet.addRow({
            manufacturingDate: row.manufacturingDate,
            batchNo: row.batchNo,
            operatorName: row.operatorName,
            product: row.product.name,
            manufacturingQty: Number(row.manufacturingQty),
            salesQty: Number(row.salesQty),
            returnQty: Number(row.returnQty),
            stockQty: Number(row.stockQty),
            salesPrice: Number(row.salesPrice),
            totalSales: Number(row.salesQty) * Number(row.salesPrice)
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

    const totalRow = worksheet.addRow([
        "Total", "", "","",
        { formula: `SUM(E3:E${lastRow - 1})` },
        { formula: `SUM(F3:F${lastRow - 1})` },
        { formula: `SUM(G3:G${lastRow - 1})` },
        { formula: `SUM(H3:H${lastRow - 1})` },
        { formula: `SUM(I3:I${lastRow - 1})` },
        { formula: `SUM(J3:J${lastRow - 1})` },
    ]);

    totalRow.eachCell((cell) => {
        cell.font = totalStyle.font;
        cell.alignment = totalStyle.alignment;
        cell.fill = totalStyle.fill;
    });

    // 🎯 Save Excel File
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Finished Good Stock Report.xlsx");
}

export default FinishGoodExcelReport;