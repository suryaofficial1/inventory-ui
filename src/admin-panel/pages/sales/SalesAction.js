import { Button, Grid, MenuItem, TextField } from '@material-ui/core'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PopupAction from '../../../common/PopupAction'
import CustomerSpellSearch from '../../../common/select-box/CustomerSpellSearch'
import ProductionProductSelect from '../../../common/select-box/ProductionProductSelect'
import UnitSelect from '../../../common/select-box/UnitSelect'
import { ADD_SALES_DETAILS, AVAILABLE_PRODUCTION_PRODUCT_QTY, UPDATE_SALES_DETAILS } from '../../../config/api-urls'
import { useLoader } from '../../../hooks/useLoader'
import { showMessage } from '../../../utils/message'
import { sendGetRequest, sendPostRequestWithAuth } from '../../../utils/network'
import { validateNumber } from '../../../utils/validation'

const SalesAction = ({ onClose, successAction, title, selectedData = {}, readOnly = false }) => {
    const [formsData, setFormsData] = useState(() => ({
        customer: selectedData?.customer ? selectedData.customer : '' || '',
        product: selectedData?.product ? selectedData.product : '' || '',
        pDesc: selectedData.pDesc || '',
        invoiceNo: selectedData.invoiceNo || '',
        salesDate: moment(selectedData.salesDate).local().format('YYYY-MM-DD') || '',
        qty: selectedData.qty || '',
        salesPrice: selectedData.salesPrice || '',
        unit: selectedData.unit || '',
        status: selectedData.status || '1',
    }));
    const [{ start, stop }, Loader] = useLoader();
    const [availableQty, setAvailableQty] = useState(0);
    const [errors, setErrors] = useState({});
    const user = useSelector((state) => state.user);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "qty") {
            const numericValue = Number(value);
            const qtyValidation = validateNumber("Quantity", value);
            if (qtyValidation.error) {
                setErrors({ ...errors, ["qty"]: qtyValidation.message });
                return;
            }
            if (!formsData.product) {
                showMessage("error", "Product selection is required before entering quantity!");
                return;
            }

            if (numericValue > availableQty) {
                setErrors({ ...errors, ["qty"]: `Quantity cannot exceed available stock: ${availableQty}` });
                return;
            }
            setErrors({ ...errors, ["qty"]: "" });
            setFormsData((prev) => ({
                ...prev,
                [name]: numericValue,
            }));
        } else {
            setFormsData((prev) => ({ ...prev, [name]: value }));
        }
    };

    useEffect(() => {
        if (formsData.product.id) {
            getAvailableQty();
        }
    }, [formsData.product.id, formsData.qty]);


    const getAvailableQty = async () => {
        try {
            const res = await sendGetRequest(AVAILABLE_PRODUCTION_PRODUCT_QTY(formsData.product.id), user.token);
            if (res.status === 200) {
                setAvailableQty(res.data.availableQty);
            } else {
                console.error("Error in getting available quantity", res.data);
                return 0;
            }
        } catch (err) {
            console.error("Error fetching available quantity", err);
            return 0;
        }
    };

    const validation = () => {
        const errors = {};
        if (!formsData.invoiceNo) errors.invoiceNo = "invoice Number is required";
        if (!formsData.customer) errors.customer = "Customer is required";
        if (!formsData.product) errors.product = "Product is required";
        if (!formsData.salesDate) errors.salesDate = "Sales Date is required";
        if (!formsData.unit) errors.unit = "Unit is required";
        if (!formsData.salesPrice) errors.salesPrice = "Sales Price is required";
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
            invoiceNo: formsData.invoiceNo,
            customer: formsData.customer.id,
            product: formsData.product.id,
            salesDate: formsData.salesDate,
            salesPrice: formsData.salesPrice,
            unit: formsData.unit,
            qty: formsData.qty,
            pDesc: formsData.pDesc,
            invoiceNo: formsData.invoiceNo,
            status: formsData.status,
        }
        const url = selectedData.id ? UPDATE_SALES_DETAILS(selectedData.id) : ADD_SALES_DETAILS;
        const action = selectedData.id ? 'updated' : 'added';
        start()
        sendPostRequestWithAuth(url, reqData, user.token).then((res) => {
            if (res.status === 200) {
                successAction()
                showMessage('success', `New sales record ${action} successfully `);
                onClose();
            } else if (res.status === 400) {
                showMessage('error', res.data);
            } else if (res.status === 409) {
                showMessage('error', res.message);
            } else {
                showMessage('error', "Something went wrong in " + action + " sales record!");
            }
        }).catch((err) => {
            console.log(err);
            showMessage('error', "Something went wrong in " + action + " sales record!");
        }).finally(() => stop())
    }

    const handleCustomerChange = (e) => {
        setFormsData({ ...formsData, ["customer"]: e });
    };
    const handleProductChange = (e) => {
        setFormsData({ ...formsData, ["product"]: e, ["qty"]: '' });
    };

    const handleReset = () => {
        setFormsData({ pName: '', cName: '' });
        setFormsData({ ...formsData, ["customer"]: '', ['product']: '' });
        handleProductChange('');
        handleCustomerChange('');
    };

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
                        <CustomerSpellSearch onChange={handleCustomerChange} value={formsData.customer} onReset={handleReset} />
                    </Grid>
                    <Grid item xs={6}>
                        <ProductionProductSelect type="sales" onChangeAction={handleProductChange} value={formsData.product} onReset={handleReset} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Invoice No"
                            variant="outlined"
                            fullWidth
                            name='invoiceNo'
                            size='small'
                            value={formsData.invoiceNo}
                            placeholder="Enter Invoice No..."
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
                            name="salesDate"
                            value={formsData.salesDate}
                            onChange={handleInputChange}
                            label="Sales Date"
                            type="date"
                            size="small"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                format: "yy/MM/dd"
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <UnitSelect onChange={handleInputChange} value={formsData.unit} readOnly={readOnly} />
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

                    <Grid item xs={12}>
                        <TextField
                            label="Quantity"
                            variant="outlined"
                            fullWidth
                            name="qty"
                            size="small"
                            value={formsData.qty}
                            placeholder="Enter Quantity..."
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            error={Boolean(errors.qty)}
                            helperText={errors.qty}
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