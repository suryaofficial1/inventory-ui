import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import React from 'react';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);



const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

export default function NewProductionDetails({ data }) {
    const classes = useStyles();
    const rows = [
        createData(data.pDate, data.product, data.customer, data.operatorName, data.qty, data.unit, data.status),
    ];

    function createData(pDate, product, customer, operatorName, quantity, unit, status) {
        return { pDate, product, customer, operatorName, quantity, unit, status };
    }

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="left">Manufacturing Date</StyledTableCell>
                        <StyledTableCell align="center">Manufacturing Product</StyledTableCell>
                        <StyledTableCell align="center">Customer</StyledTableCell>
                        <StyledTableCell align="center">Operator</StyledTableCell>
                        <StyledTableCell align="center">Quantity</StyledTableCell>
                        <StyledTableCell align="center">Unit</StyledTableCell>
                        <StyledTableCell align="center">Status</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.name}>
                            <StyledTableCell align="left">{moment(row.pDate).format("DD-MM-YYYY")}</StyledTableCell>
                            <StyledTableCell align="center">{row.product.name}</StyledTableCell>
                            <StyledTableCell align="center">{row.customer.name}</StyledTableCell>
                            <StyledTableCell align="center">{row.operatorName}</StyledTableCell>
                            <StyledTableCell align="center">{row.quantity}</StyledTableCell>
                            <StyledTableCell align="center">{row.unit}</StyledTableCell>
                            <StyledTableCell align="center">{row.status ? "Active" : "Inactive"}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
