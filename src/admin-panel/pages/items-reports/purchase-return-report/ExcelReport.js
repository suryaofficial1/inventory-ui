
import ExcelJS from "exceljs";
import { showMessage } from "../../../../utils/message";

  const getValues = (filter) => {
    let reportBy;
    if (filter && filter.product && !filter.supplier) {
      reportBy = " Purchase return report by Product : " + filter.product
    } else if (filter && filter.supplier && !filter.product) {
      reportBy = " Purchase  return report by Supplier : " + filter.supplier.name
    } else if (filter && (filter.product && filter.supplier)) {
      reportBy = " Purchase  return report by Product : " + filter.product + " and " + " Supplier : " + filter.supplier.name
    }

    else {
      reportBy = 'Overview All Purchase return report'
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
    const worksheet = workbook.addWorksheet("Purchase return report");

    // 🎨 Define Styles
    const titleStyle = {
        font: { bold: true, size: 18, color: { argb: "FFFFFF" } },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } }
    };

    const headerStyle = {
        font: { bold: true, size: 16, color: { argb: "FFFFFF" } },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } }
    };

    const totalStyle = {
        font: { bold: true },
        alignment: { horizontal: "center" },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "D9EAD3" } }
    };

    // 🎯 Add Title (Merged)
    worksheet.mergeCells("A1:H1"); // Merge first row for title
    worksheet.getCell("A1").value = getValues(formsData);
    const titleCell = worksheet.getCell("A1");
    titleCell.font = titleStyle.font;
    titleCell.alignment = titleStyle.alignment;
    titleCell.fill = titleStyle.fill;

    // 🎯 Column Headers
    const headers = ["Purchase Return Date", "invoice No", "Batch No", "Supplier Name", "Product Name", "Qty", "Return Amount", "Total Return Amount"];
    worksheet.addRow([]); // Add empty row for spacing
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
        cell.font = headerStyle.font;
        cell.alignment = headerStyle.alignment;
        cell.fill = headerStyle.fill;
    });

    // 🎯 Define Column Widths & Alignment
    worksheet.columns = [
        { key: "returnDate", width: 30, alignment: { horizontal: "left" } },
        { key: "invoiceNo", width: 20, alignment: { horizontal: "center" } },
        { key: "bNumber", width: 20, alignment: { horizontal: "center" } },
        { key: "supplier", width: 30, alignment: { horizontal: "center" } },
        { key: "product", width: 30, alignment: { horizontal: "center" } },
        { key: "qty", width: 10, alignment: { horizontal: "center" }, numFmt: 0 },
        { key: "returnAmount", width: 30, alignment: { horizontal: "center" }, numFmt: "0.00" },
        { key: "totalReturnAmount", width: 30, alignment: { horizontal: "center" }, numFmt: "0.00" }
    ];

    // 🎯 Add Data Rows
    salesData.forEach(row => {
        const rowData = worksheet.addRow({
            returnDate: row.returnDate,
            purchaseExpiryDate: row.purchaseExpiryDate,
            invoiceNo: row.invoiceNo,
            bNumber: row.bNumber,
            supplier: row.supplier.name,
            product: row.product.name,
            qty: Number(row.qty),
            returnAmount: Number(row.returnAmount),
            totalReturnAmount: Number(row.qty) * Number(row.returnAmount)
        });

        rowData.eachCell((cell, colNumber) => {
                cell.alignment = { horizontal: "center" };
        });
    });

    worksheet.addRow([]);
    const lastRow = worksheet.rowCount;

    const totalRow = worksheet.addRow([
        "Total", "", "","", "",
        { formula: `SUM(G3:G${lastRow - 1})` },
        "",
        { formula: `SUM(I3:I${lastRow - 1})` }
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
}

export default ExcelReportAction;