import ExcelJS from "exceljs";
import { saveAs } from "file-saver";


const getValues = (filter) => {
    let reportBy;
    if (filter && filter.product && !filter.supplier) {
        reportBy = "Purchase Stock  Report by Product : " + filter.product
    } else if (filter && filter.supplier && !filter.product) {
        reportBy = "Purchase Stock  Report by Supplier : " + filter.supplier.name
    } else if (filter && (filter.product && filter.supplier)) {
        reportBy = "Purchase Stock  Report by Product : " + filter.product + " and " + " Supplier : " + filter.supplier.name
    }

    else {
        reportBy = 'Overview All Purchase Stock Report'
    }
    return reportBy
}

export const exportPurchaseStock = async (data, formsData) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Purchase Stock Report");

    sheet.columns = [
        { key: "purchaseDate", header: "Purchase Date", width: 27, alignment: { horizontal: "center" } },
        { key: "purchaseExpiryDate", header: "Purchase Expiry Date", width: 27, alignment: { horizontal: "center" } },
        { key: "product", header: "Product", width: 30, alignment: { horizontal: "center" } },
        { key: "supplier", header: "Supplier", width: 30, alignment: { horizontal: "center" } },
        { key: "invoiceNo", header: "Invoice No", width: 10, alignment: { horizontal: "center" } },
        { key: "batch", header: "Batch No", width: 10, alignment: { horizontal: "center" } },
        { key: "unit", header: "Unit", width: 8, alignment: { horizontal: "center" } },
        { key: "purchaseQty", header: "Purchase Qty", width: 15, cellType: "number", alignment: { horizontal: "center" }, style: { numFmt: 0 } },
        { key: "returnDate", header: "Return Date", width: 25, alignment: { horizontal: "center" } },
        { key: "returnQty", header: "Return Qty", width: 15, alignment: { horizontal: "center" }, style: { numFmt: 0 } },
        { key: "prodDate", header: "Production Date", width: 20, alignment: { horizontal: "center" } },
        { key: "usedProduct", header: "Manufacturing Product", width: 20, alignment: { horizontal: "center" } },
        { key: "operator", header: "Operator", width: 20, alignment: { horizontal: "center" } },
        { key: "useQty", header: "Use Qty", width: 15, alignment: { horizontal: "center" }, style: { numFmt: 0 } },
        { key: "rejectQty", header: "Reject Qty", width: 15, alignment: { horizontal: "center" }, style: { numFmt: 0 } },
        { key: "totalUseQty", header: "Total Use Qty", width: 15, alignment: { horizontal: "center" }, style: { numFmt: 0 } },
        { key: "stockQty", header: "Stock Qty", width: 15, alignment: { horizontal: "center" }, style: { numFmt: 0 } },
        { key: "purchaseAmount", header: "Purchase Amount", width: 20, alignment: { horizontal: "center" }, style: { numFmt: "0.00" } },
        { key: "totalPurchaseAmount", header: "Total Purchase Amount", width: 25, alignment: { horizontal: "center" }, style: { numFmt: "0.00" } }
    ];

    sheet.mergeCells("A1:S2");
    const titleCell = sheet.getCell("A1");
    titleCell.value = getValues(formsData);
    titleCell.font = { size: 20, bold: true, color: { argb: "FFFFFF" } };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4472C4" }
    };

    const headerRow = sheet.addRow(sheet.columns.map(col => col.header || col.key));
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 25;

    sheet.mergeCells("K3:O3");
    const whereUseProductCell = sheet.getCell("K3");
    whereUseProductCell.value = "Where Use Product";
    whereUseProductCell.font = { bold: true, color: { argb: "FFFFFF" } };
    whereUseProductCell.alignment = { vertical: "middle", horizontal: "center" };
    whereUseProductCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4573c47a" }
    };

    const subHeaders = [
        "", "", "", "", "", "", "", "", "", "",
        "Production Date", "Product Name", "Operator Name", "Use Material Qty", "Reject qty",
        "", "", "", ""
    ];
    const subHeaderRow = sheet.addRow(subHeaders);
    subHeaderRow.height = 22;

subHeaderRow.eachCell((cell, colNumber) => {
  if (colNumber >= 11 && colNumber <= 15) {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D9EAF7" }
    };
    cell.font = { bold: true };
    cell.alignment = { vertical: "middle", horizontal: "center" };

    if (colNumber === 14 || colNumber === 15) {
      cell.numFmt = 0;
    }
  }
});


    const columnsToMerge = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 17, 18, 19];
    columnsToMerge.forEach(col => {
        sheet.mergeCells(3, col, 4, col);
    });

    const keyToColumnMap = {};
    sheet.columns.forEach((col, idx) => {
        keyToColumnMap[col.key] = idx + 1;
    });

    let currentRow = 5;
    data.forEach(item => {
        const rowspan = item.usages.length;

        item.usages.forEach((use, i) => {
            const rowData = {
                ...((i === 0) ? {
                    ...item,
                    product: item.product?.name || "",
                    supplier: item.supplier?.name || ""
                } : {}),
                ...use
            };

            const row = sheet.addRow(rowData);
            row.alignment = { vertical: "middle", horizontal: "center" };
            row.eachCell(cell => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };
            });

            currentRow++;
        });

        if (rowspan > 1) {
            Object.keys(item).forEach(key => {
                if (key !== 'usages' && keyToColumnMap[key]) {
                    const col = keyToColumnMap[key];
                    sheet.mergeCells(currentRow - rowspan, col, currentRow - 1, col);
                }
            });
        }
    });


    const footerRow = sheet.getRow(currentRow);
    sheet.mergeCells(`A${currentRow}:G${currentRow}`);
    footerRow.getCell(1).value = "Total";
    footerRow.getCell(8).value = { formula: `SUM(H5:H${currentRow - 1})` };
    footerRow.getCell(10).value = { formula: `SUM(J5:J${currentRow - 1})` };
    sheet.mergeCells(`K${currentRow}:O${currentRow}`);
    footerRow.getCell(16).value = { formula: `SUM(P5:P${currentRow - 1})` };
    footerRow.getCell(17).value = { formula: `SUM(Q5:Q${currentRow - 1})` };
    footerRow.getCell(19).value = { formula: `SUM(S5:S${currentRow - 1})` };

    footerRow.font = { bold: true };
    footerRow.alignment = { vertical: "middle", horizontal: "center" };
    footerRow.height = 30;

    // Apply background and border to all cells from A to S
    for (let col = 1; col <= 19; col++) {
        const cell = footerRow.getCell(col);
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F2F2F2" }
        };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
    }


    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Purchase_Stock_Report.xlsx");
};
