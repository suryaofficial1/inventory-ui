import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import "jspdf-autotable";
import React, { useState } from "react";

const SalesReportTable = ({ data, onSuccess }) => {

    const [selectedData, setSelectedData] = useState({})
    const handelAction = (row) => {
        setSelectedData(row)
    }

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Price</TableCell>
                            {/* <TableCell>Action</TableCell> */}
                        </TableRow>
                    </TableHead>
                    {data?.rows?.length > 0 ? (
                        <>
                            <TableBody>
                                {data.rows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.customer.name}</TableCell>
                                        <TableCell>{row.product.name}</TableCell>
                                        <TableCell>{row.qty}</TableCell>
                                        <TableCell>{row.price}</TableCell>
                                        {/* <TableCell ><Edit color='primary' className='pointer-cursor' onClick={() => handelAction(row)} /></TableCell> */}
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
            {/* {selectedData.id && <SalesAction onClose={() =>setSelectedData({})} 
                successAction={onSuccess}
                title={"Update Sales Record"}
                selectedData={selectedData}
                />} */}
        </div>
    );
};

export default SalesReportTable;
