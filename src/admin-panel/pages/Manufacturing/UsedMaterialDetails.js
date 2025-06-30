import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Delete, Edit } from '@material-ui/icons';

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

export default function UsedMaterialDetails({ data,  deleteAction, readOnly }) {
    const classes = useStyles();
    function createData(id, supplier, product, mqty, mPrice, rqty, rPrice, lqty, lPrice) {
        return { id, supplier, product, mqty, mPrice, rqty, rPrice, lqty, lPrice };
    }

    const rows = data
        ? data.map((item) =>
            createData(
                item.id,
                item.supplier,
                item.product,
                item.mqty,
                item.mPrice,
                item.rqty,
                item.rPrice,
                item.lqty,
                item.lPrice
            )
        )
        : [];

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        {!readOnly && <StyledTableCell align="center">Actions</StyledTableCell>}                        <StyledTableCell align="left">#id</StyledTableCell>
                        <StyledTableCell align="left">Supplier</StyledTableCell>
                        <StyledTableCell align="left">Product</StyledTableCell>
                        <StyledTableCell align="center">Material Quantity</StyledTableCell>
                        <StyledTableCell align="center">Material Price</StyledTableCell>
                        <StyledTableCell align="center">Rejection Material</StyledTableCell>
                        <StyledTableCell align="center">Rejection Price</StyledTableCell>
                        <StyledTableCell align="center">Lumps Quantity</StyledTableCell>
                        <StyledTableCell align="center">Lumps Price</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.id}>
                            { !readOnly && <StyledTableCell align="center" style={{ display: 'flex', flexDirection: 'row' }}>
                                {/* <Edit color='primary'
                                    style={{ cursor: 'pointer', marginRight: '10px' }}
                                    onClick={() => editAction(row)}
                                /> */}
                               <Delete color='secondary' 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => deleteAction(row)}
                                    />
                            </StyledTableCell>} 
                            <StyledTableCell align="left">{row.id}</StyledTableCell>
                            <StyledTableCell align="left">{row.supplier.name}</StyledTableCell>
                            <StyledTableCell align="left">{row.product.name}</StyledTableCell>
                            <StyledTableCell align="center">{row.mqty}</StyledTableCell>
                            <StyledTableCell align="center">{row.mPrice}</StyledTableCell>
                            <StyledTableCell align="center">{row.rqty}</StyledTableCell>
                            <StyledTableCell align="center">{row.rPrice}</StyledTableCell>
                            <StyledTableCell align="center">{row.lqty}</StyledTableCell>
                            <StyledTableCell align="center">{row.lPrice}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
