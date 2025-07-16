import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { showMessage } from "../../../../utils/message";

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
const FifoExcelReport = async (data, formsData) => {
    if (!data?.length) {
        showMessage("error", "No data available to export!");
        return;
    }
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("FIFO Report");

    const headers = [
        { key: "purchaseDate", header: "Purchase Date", width: 18 },
        { key: "purchaseExpiryDate", header: "Purchase Expiry Date", width: 20 },
        { key: "product", header: "Product", width: 20 },
        { key: "supplier", header: "Supplier", width: 20 },
        { key: "batch", header: "Batch No", width: 15 },
        { key: "purchaseQty", header: "Purchase Qty", width: 15 },
        { key: "returnQty", header: "Return Qty", width: 15 },
        { key: "rate", header: "Rate", width: 15 },
        { key: "purchaseAmount", header: "Purchase - Amt", width: 20 },
        { key: "prodDate", header: "Production Date", width: 20 },
        { key: "usedProduct", header: "Product Name", width: 20 },
        { key: "useQty", header: "Use Qty", width: 15 },
        { key: "stockQty", header: "Avl Qty", width: 15 },
        { key: "totalPurchaseAmount", header: "Total", width: 18 }
    ];

    sheet.columns = headers;

    // Header Styling
    sheet.mergeCells("A1:N1");
    const title = sheet.getCell("A1");
    title.value = getValues(formsData);
    title.alignment = { horizontal: "center", vertical: "middle" };
    title.font = { bold: true, size: 16, color: { argb: "FFFFFF" } };
    title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4472C4" } };

    // Section Headings
    sheet.mergeCells("A2:I2");
    sheet.getCell("A2").value = "Purchase";
    sheet.getCell("A2").alignment = { horizontal: "center", vertical: "middle" };;
    sheet.getCell("A2").font = { bold: true };
    sheet.getCell("A2").border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };
    sheet.getCell("A2").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };

    sheet.mergeCells("J2:L2");
    sheet.getCell("J2").value = "Production";
    sheet.getCell("J2").alignment = { horizontal: "center", vertical: "middle" };;
    sheet.getCell("J2").font = { bold: true };
    sheet.getCell("J2").border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };
    sheet.getCell("J2").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };

    sheet.mergeCells("M2:N2");
    sheet.getCell("M2").value = "Inventory";
    sheet.getCell("M2").alignment = { horizontal: "center", vertical: "middle" };;
    sheet.getCell("M2").font = { bold: true };
    sheet.getCell("M2").border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };
    sheet.getCell("M2").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };

    sheet.getRow(2).height = 30;
    // Table Headers
    const headerRow = sheet.getRow(3);
    headers.forEach((h, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.value = h.header;
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F2F2F2" } };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
    });
    headerRow.height = 30;

    const keyToColumnMap = headers.reduce((map, h, i) => {
        map[h.key] = i + 1;
        return map;
    }, {});

    // Data Rows
    let currentRow = 4;
    data.forEach(item => {
        const rowspan = item.usages?.length || 1;

        (item.usages && item.usages.length > 0 ? item.usages : [{}]).forEach((usage, i) => {
            const rowData = {
                purchaseDate: i === 0 ? item.purchaseDate : "-----",
                purchaseExpiryDate: i === 0 ? item.purchaseExpiryDate : "-----",
                product: i === 0 ? item.product?.name : "-----",
                supplier: i === 0 ? item.supplier?.name : "-----",
                batch: i === 0 ? item.batch : "-----",
                purchaseQty: i === 0 ? Number(item.purchaseQty) : "-----",
                returnQty: i === 0 ? Number(item.returnQty) : "-----",
                rate: i === 0 ? Number(item.purchaseAmount) : "-----",
                purchaseAmount: i === 0 ? Number(item.purchaseQty || 0) * Number(item.purchaseAmount) : "-----",
                prodDate: usage?.prodDate || "-----",
                usedProduct: usage?.usedProduct || "-----",
                useQty: Number(usage?.useQty) || "-----",
                stockQty: i === 0 ? Number(item.stockQty) : "-----",
                totalPurchaseAmount: i === 0 ? Number(item.stockQty) * Number(item.purchaseAmount) : "-----"
            };

            const row = sheet.addRow(rowData);
            row.height = 20;
            row.eachCell(cell => {
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };
            });

            currentRow++;
        });

        // Merge shared cells if more than 1 usage
        if (rowspan > 1) {
            [
                "purchaseDate",
                "purchaseExpiryDate",
                "product",
                "supplier",
                "batch",
                "purchaseQty",
                "returnQty",
                "rate",
                "purchaseAmount",
                "stockQty",
                "totalPurchaseAmount"
            ].forEach(key => {
                const col = keyToColumnMap[key];
                if (col) {
                    sheet.mergeCells(currentRow - rowspan, col, currentRow - 1, col);
                }
            });
        }
    });

    // Total Row
    const totalRow = sheet.getRow(currentRow);
    sheet.mergeCells(`A${currentRow}:E${currentRow}`);
    totalRow.getCell("A").value = "Total";
    totalRow.getCell("A").alignment = { horizontal: "right" };
    totalRow.getCell("A").font = { bold: true };

    totalRow.getCell("F").value = { formula: `SUM(F4:F${currentRow - 1})` };
    totalRow.getCell("G").value = { formula: `SUM(G4:G${currentRow - 1})` };
    totalRow.getCell("H").value = { formula: `SUM(H4:H${currentRow - 1})` };
    totalRow.getCell("H").numFmt = '"₹"#,##0.00';
    totalRow.getCell("I").value = { formula: `SUM(I4:I${currentRow - 1})` };
    totalRow.getCell("I").numFmt = '"₹"#,##0.00';
    totalRow.getCell("J").value = '';
    totalRow.getCell("K").value = '';
    totalRow.getCell("L").value = { formula: `SUM(L4:L${currentRow - 1})` };
    totalRow.getCell("M").value = { formula: `SUM(M4:M${currentRow - 1})` };
    totalRow.getCell("N").value = { formula: `SUM(N4:N${currentRow - 1})` };
    totalRow.getCell("N").numFmt = '"₹"#,##0.00';

    totalRow.height = 30;

    totalRow.eachCell(cell => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };;
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D9D9D9" }
        };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
    });

    // Final export
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    saveAs(blob, "FIFO_Stock_Report.xlsx");
};

export default FifoExcelReport;
