import React from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Paper,
} from "@mui/material";

const cellStyle = {
    border: '1px solid rgb(180, 179, 179)',
};
const cellStyleHeigh = {
    background: '#d92121',
    color: "#fff"
};
const cellStyleAvrg = {
    background: 'rgb(219, 223, 86)',
    // color: "#fff"
};
const cellStyleLow = {
    background: 'rgb(22, 149, 69)',
    color: "#fff"
};
const cellFooterStyle = {
    border: '1px solid rgb(180, 179, 179)',
    fontWeight: 'bold',
    fontSize: '14px',
    color: 'black'
};

const StockReportTable = ({ data }) => {
    const totals = data?.reduce(
        (acc, row) => {
            acc.pQty += Number(row.pQty) || 0;
            acc.purchaseAmount += Number((row.pRate) || 0) * Number((row.pQty) || 0);
            acc.mQty += Number(row.mQty) || 0;
            acc.balanceQty += Number(row.balanceQty) || 0;
            acc.inventoryAmount += Number((row.pRate) || 0) * Number((row.balanceQty) || 0);
            return acc;
        },
        { pQty: 0, purchaseAmount: 0, mQty: 0, balanceQty: 0, inventoryAmount: 0 }
    );

    const total1 = data?.map((row) => {
        return row.pQty + row.mQty;
    });

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell rowSpan={2} sx={cellStyle}>Date</TableCell>
                        <TableCell rowSpan={2} sx={cellStyle}>Product Name</TableCell>
                        <TableCell colSpan={4} align="center" sx={cellStyle}>Purchase</TableCell>
                        <TableCell colSpan={3} align="center" sx={cellStyle}>Production</TableCell>
                        <TableCell colSpan={4} align="center" sx={cellStyle}>Inventory</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={cellStyle}>Qty.</TableCell>
                        <TableCell sx={cellStyle}>Batch No.</TableCell>
                        <TableCell sx={cellStyle}>Rate</TableCell>
                        <TableCell sx={cellStyle}>Amount.</TableCell>
                        <TableCell sx={cellStyle}>Manufacturing Date</TableCell>
                        <TableCell sx={cellStyle}>Batch No</TableCell>
                        <TableCell sx={cellStyle}>Quantity</TableCell>
                        <TableCell sx={cellStyle}>Reject Quantity</TableCell>
                        <TableCell sx={cellStyle}>Balance Quantity.</TableCell>
                        <TableCell sx={cellStyle}>Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data && data.map((row, index) => {
                        const percentage = (Number(row.balanceQty) / Number(row.pQty)) * 100;

                        let balanceStyle;

                        if (percentage >= 70) {
                            balanceStyle = cellStyleHeigh;
                        } else if (percentage >= 40 && percentage < 70) {
                            balanceStyle = cellStyleAvrg;
                        } else if (percentage <= 40) {
                            balanceStyle = cellStyleLow;
                        }

                        return (
                            <TableRow key={index}>
                                <TableCell sx={cellStyle}>{row.purchaseDate}</TableCell>
                                <TableCell sx={cellStyle}>{row.product}</TableCell>
                                <TableCell sx={cellStyle}>{row.pQty}</TableCell>
                                <TableCell sx={cellStyle}>{row.pBatchNo}</TableCell>
                                <TableCell sx={cellStyle}>{row.pRate}</TableCell>
                                <TableCell sx={cellStyle}>{row.pRate * row.pQty}</TableCell>
                                <TableCell sx={cellStyle}>{row.mDate}</TableCell>
                                <TableCell sx={cellStyle}>{row.pBatchNo}</TableCell>
                                <TableCell sx={cellStyle}>{row.mQty}</TableCell>
                                <TableCell sx={cellStyle}>{row.rQty}</TableCell>
                                <TableCell sx={balanceStyle}>{row.balanceQty}</TableCell>
                                <TableCell sx={cellStyle}>{row.pRate * row.balanceQty}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>


                <TableFooter>
                    <TableRow>
                        <TableCell sx={cellFooterStyle} colSpan={2}>Total</TableCell>
                        <TableCell sx={cellFooterStyle}>{totals?.pQty}</TableCell>
                        <TableCell sx={cellFooterStyle} colSpan={2}></TableCell>
                        <TableCell sx={cellFooterStyle}>{totals?.purchaseAmount}</TableCell>
                        <TableCell sx={cellFooterStyle} colSpan={2}></TableCell>
                        <TableCell sx={cellFooterStyle}>{totals?.mQty}</TableCell>
                        <TableCell sx={cellFooterStyle} colSpan={1}></TableCell>
                        <TableCell sx={cellFooterStyle}>{totals?.balanceQty}</TableCell>
                        <TableCell sx={cellFooterStyle}>{totals?.inventoryAmount}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
};

export default StockReportTable;
