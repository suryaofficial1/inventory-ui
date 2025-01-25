import { Button, Grid, MenuItem, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import PopupAction from '../../../common/PopupAction'
import { ADD_SALES_DETAILS, CUSTOMERS, PRODUCTS, UPDATE_SALES_DETAILS } from '../../../config/api-urls'
import { useLoader } from '../../../hooks/useLoader'
import { showMessage } from '../../../utils/message'
import { sendGetRequest, sendPostRequest } from '../../../utils/network'
import moment from 'moment'

const SalesAction = ({ onClose, successAction, title, selectedData = {}, readOnly = false }) => {
    const [formsData, setFormData] = useState(() => ({
        customer: selectedData?.customer ? selectedData.customer.id : '' || '',
        product: selectedData?.product ? selectedData.product.id : '' || '',
        pDesc: selectedData.pDesc || '',
        salesDate: moment(selectedData.salesDate).local().format('YYYY-MM-DD') || '',
        qty: selectedData.qty || '',
        salesPrice: selectedData.salesPrice || '',
        unit: selectedData.unit || '',
        status: selectedData.status || '1',
    }));
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [{ start, stop }, Loader] = useLoader();

    useEffect(() => {
        getCustomers();
        getProducts();
    }, []);

    const getCustomers = () => {
        start()
        sendGetRequest(CUSTOMERS, "token")
            .then(res => {
                if (res.status === 200) {
                    setCustomers(res.data);
                } else {
                    console.log("Error in get customers", res.data)
                }
            }).catch(err => {
                console.log(err)
            }).finally(stop)
    }
    const getProducts = () => {
        start()
        sendGetRequest(PRODUCTS, "token")
            .then(res => {
                if (res.status === 200) {
                    setProducts(res.data);
                } else {
                    console.log("Error in get products", res.data)
                }
            }).catch(err => {
                console.log(err)
            }).finally(stop)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    console.log("formsData", formsData)

    const validation = () => {
        const errors = {};
        if (!formsData.customer) errors.customer = "Customer is required";
        if (!formsData.product) errors.product = "Product is required";
        if (!formsData.salesDate) errors.salesDate = "Sales Date is required";
        if (!formsData.salesPrice) errors.salesPrice = "Sales Price is required";
        if (!formsData.unit) errors.unit = "Unit is required";
        if (!formsData.qty) errors.qty = "Quantity is required";
        if (!formsData.pDesc) errors.pDesc = "Description is required";
        if (!formsData.status) errors.status = "Status is required";
        if (Object.keys(errors).length > 0) {
            showMessage("error", errors[Object.keys(errors)[0]]);
            return true;
        }
        return false;
    }

    const submitAction = () => {
        if (validation()) return;
        const reqData = {
            customer: formsData.customer,
            product: formsData.product,
            salesDate: formsData.salesDate,
            salesPrice: formsData.salesPrice,
            unit: formsData.unit,
            qty: formsData.qty,
            pDesc: formsData.pDesc,
            status: formsData.status,
        }
        const url = selectedData.id ? UPDATE_SALES_DETAILS(selectedData.id) : ADD_SALES_DETAILS;
        const action = selectedData.id ? 'updated' : 'added';
        start()
        sendPostRequest(url, reqData, true).then((res) => {
            if (res.status === 200) {
                successAction()
                showMessage('success', `Product successfully ${action}`);
                onClose();
            } else if (res.status === 400) {
                showMessage('error', res.data);
            } else if (res.status === 409) {
                showMessage('error', res.message);
            } else {
                showMessage('error', "Something went wrong in " + action + " product!");
            }
        }).catch((err) => {
            console.log(err);
            showMessage('error', "Something went wrong in " + action + " product!");
        }).finally(() => stop())
    }

    return (
        <>
            <Loader />
            <PopupAction onClose={onClose} title={title} width={700}
                actions={
                    !readOnly && (
                        <Button variant="contained" color="primary" onClick={submitAction}>
                            Save
                        </Button>
                    )
                }
            >
                <Grid container spacing={3} style={{ padding: 20 }}>
                    <Grid item xs={6}>
                        <TextField fullWidth id="Customer"
                            onChange={handleInputChange}
                            name='customer'
                            label="Customer"
                            variant='outlined'
                            size='small'
                            value={formsData.customer} select>
                            {customers.map((item) => (
                                <MenuItem value={item.id}>{item.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth id="Product"
                            onChange={handleInputChange}
                            name='product'
                            label="Product"
                            variant='outlined'
                            size='small'
                            value={formsData.product} select>
                            {products.map((item) => (
                                <MenuItem value={item.id}>{item.name}-{item.pCode}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            name="salesDate"
                            value={formsData.salesDate}
                            onChange={handleInputChange}
                            label="Sales Date"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                format: "MM/dd/yy"
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Sales Price"
                            variant="outlined"
                            fullWidth
                            name='salesPrice'
                            size='small'
                            value={formsData.salesPrice}
                            placeholder="Enter Sales Price..."
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Unit"
                            variant="outlined"
                            fullWidth
                            name='unit'
                            size='small'
                            value={formsData.unit}
                            placeholder="Enter Unit..."
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Quantity"
                            variant="outlined"
                            fullWidth
                            name='qty'
                            size='small'
                            value={formsData.qty}
                            placeholder="Enter Quantity..."
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            size='small'
                            name='pDesc'
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            value={formsData.pDesc}
                            placeholder="Enter Description..."
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth id="status"
                            onChange={handleInputChange}
                            name='status'
                            label="Status"
                            variant='outlined'
                            size='small'
                            value={formsData.status} select>
                            <MenuItem value="1">Active</MenuItem>
                            <MenuItem value="0">Inactive</MenuItem>

                        </TextField>
                    </Grid>
                </Grid>
            </PopupAction >
        </>
    )
}

export default SalesAction;