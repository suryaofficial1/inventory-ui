import { Button, Grid, MenuItem, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import PopupAction from '../../../../common/PopupAction'
import { ADD_PRODUCTION_DETAILS, CUSTOMERS_LIST, PRODUCTS_LIST, UPDATE_PRODUCTION_DETAILS } from '../../../../config/api-urls'
import { useLoader } from '../../../../hooks/useLoader'
import { showMessage } from '../../../../utils/message'
import { sendGetRequest, sendPostRequest } from '../../../../utils/network'
import moment from 'moment'

const ProductoinAction = ({ onClose, successAction, title, selectedData = {}, readOnly = false }) => {
    const [formsData, setFormData] = useState(() => ({
        customer: selectedData?.customer ? selectedData.customer.id : '' || '',
        product: selectedData?.product ? selectedData.product.id : '' || '',
        pDesc: selectedData.pDesc || '',
        qty: selectedData.qty || '',
        unit: selectedData.unit || '',
        operatorName: selectedData.operatorName || '',
        comment: selectedData.comment || '',
        manufacturingDate: moment(selectedData.manufacturingDate).local().format('YYYY-MM-DD') || '',
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
        sendGetRequest(CUSTOMERS_LIST, "token")
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
        sendGetRequest(PRODUCTS_LIST, "token")
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

    const validation = () => {
        const errors = {};
        if (!formsData.customer) errors.customer = "Customer is required";
        if (!formsData.product) errors.product = "Product is required";
        if (!formsData.unit) errors.unit = "Unit is required";
        if (!formsData.qty) errors.qty = "Quantity is required";
        if (!formsData.manufacturingDate) errors.manufacturingDate = "Manufacturing Date is required";
        if (!formsData.operatorName) errors.operatorName = "Operator name is required";
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
            pDesc: formsData.pDesc,
            unit: formsData.unit,
            qty: formsData.qty,
            comment: formsData.comment,
            operatorName: formsData.operatorName,
            manufacturingDate: formsData.manufacturingDate,
            status: formsData.status,
        }
        const url = selectedData.id ? UPDATE_PRODUCTION_DETAILS(selectedData.id) : ADD_PRODUCTION_DETAILS;
        const action = selectedData.id ? 'updated' : 'added';
        start()
        sendPostRequest(url, reqData, true).then((res) => {
            if (res.status === 200) {
                successAction()
                showMessage('success', `Production details successfully ${action}`);
                onClose();
            } else if (res.status === 400) {
                showMessage('error', res.data);
            } else if (res.status === 409) {
                showMessage('error', res.message);
            } else {
                showMessage('error', "Something went wrong in " + action + " production details!");
            }
        }).catch((err) => {
            console.log(err);
            showMessage('error', "Something went wrong in " + action + " production details!");
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
                    <Grid item xs={12}>
                        <TextField
                            label="Product Description"
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
                            placeholder="Enter Product Description..."
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
                    <Grid item xs={6}>
                        <TextField
                            label="Operator name"
                            variant="outlined"
                            fullWidth
                            name='operatorName'
                            size='small'
                            value={formsData.operatorName}
                            placeholder="Enter Operator name..."
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            name="manufacturingDate"
                            value={formsData.manufacturingDate}
                            onChange={handleInputChange}
                            label="Manufacturing Date"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                format: "MM/dd/yy"
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Comment"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            size='small'
                            name='comment'
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            value={formsData.comment}
                            placeholder="Enter Comment..."
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

export default ProductoinAction;