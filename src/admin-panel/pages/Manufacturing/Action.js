import { Button, Grid, MenuItem, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import moment from 'moment'
import { MuiChipsInput } from 'mui-chips-input'
import React, { useEffect, useState } from 'react'
import PopupAction from '../../../common/PopupAction'
import CustomerSpellSearch from '../../../common/select-box/CustomerSpellSearch'
import ProductSpellSearch from '../../../common/select-box/ProductSpellSearch'
import UnitSelect from '../../../common/select-box/UnitSelect'
import { ADD_PRODUCTION_DETAILS, CUSTOMERS_LIST, PRODUCTS_LIST, UPDATE_PRODUCTION_DETAILS } from '../../../config/api-urls'
import { useLoader } from '../../../hooks/useLoader'
import { showMessage } from '../../../utils/message'
import { sendGetRequest, sendPostRequest } from '../../../utils/network'

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiOutlinedInput-root": {
            padding: "10px",
            borderRadius: "15px",
        },
    },
    chip: {
        backgroundColor: "#E0E0E0",
        color: "#000",
        fontWeight: "bold",
        padding: "6px 12px",
        borderRadius: "15px",
        margin: theme.spacing(0.5),
        "& .MuiChip-deleteIcon": {
            color: "#777",
            "&:hover": {
                color: "#000",
            },
        },
    },
}));

const ProductionAction = ({ onClose, successAction, title, selectedData = {}, readOnly = false }) => {
    const classes = useStyles()
    const [formsData, setFormData] = useState(() => ({
        customer: selectedData?.customer ? selectedData.customer : '' || '',
        product: selectedData?.product ? selectedData.product : '' || '',
        pDesc: selectedData.pDesc || '',
        qty: selectedData.qty || '',
        unit: selectedData.unit || '',
        operatorName: selectedData.operatorName || '',
        manufacturingDate: moment(selectedData.manufacturingDate).local().format('YYYY-MM-DD') || '',

        materials: selectedData?.materials && selectedData?.materials.length != 0 ? JSON.parse(selectedData.materials) : [] || [],
        mqty: selectedData.mqty || '',
        mPrice: selectedData.mPrice || '',
        rqty: selectedData.rqty || '',
        rPrice: selectedData.rPrice || '',
        lqty: selectedData.lqty || '',
        lPrice: selectedData.lPrice || '',
        status: selectedData.status || '1',
    }));
 
      const [errors, setErrors] = useState({});
    
    const [{ start, stop }, Loader] = useLoader();


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "qty") {
            const numericValue = Number(value);
            if (!formsData.product) {
                showMessage("error", "Product selection is required before entering quantity!");
                return;
            }
            if (numericValue > Number(formsData.product.qty)) {
                setErrors({ ...errors, qty: `Quantity cannot exceed available stock: ${formsData.product.qty}` });
                return;
            }
            setErrors({ ...errors, qty: "" });
            setFormData((prev) => ({
                ...prev,
                [name]: numericValue,
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    

    const validation = () => {
        const errors = {};
        if (!formsData.customer) errors.customer = "Customer is required";
        if (!formsData.product) errors.product = "Product is required";
        if (!formsData.unit) errors.unit = "Unit is required";
        if (!formsData.qty) errors.qty = "Quantity is required";
        if (!formsData.manufacturingDate) errors.manufacturingDate = "Manufacturing Date is required";
        if (!formsData.operatorName) errors.operatorName = "Operator name is required";

        if (formsData.materials.length == 0) errors.materials = "Minimum one materials is required";
        if (!formsData.mqty) errors.mqty = "Material Quantity is required";
        if (!formsData.mPrice) errors.mPrice = "Material Price is required";
        if (!formsData.rqty) errors.rqty = "Rejection Quantity is required";
        if (!formsData.rPrice) errors.rPrice = "Rejection Price is required";
        if (!formsData.lqty) errors.lqty = "Lumps Quantity is required";
        if (!formsData.lPrice) errors.lPrice = "Lumps Price is required";

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
            customer: formsData.customer.id,
            product: formsData.product.id,
            pDesc: formsData.pDesc,
            unit: formsData.unit,
            qty: formsData.qty,
            operatorName: formsData.operatorName,
            manufacturingDate: formsData.manufacturingDate,
            materials: formsData.materials,
            mqty: formsData.mqty,
            mPrice: formsData.mPrice,
            rqty: formsData.rqty,
            rPrice: formsData.rPrice,
            lqty: formsData.lqty,
            lPrice: formsData.lPrice,
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


    const handleCustomerChange = (e) => {
        setFormData({ ...formsData, ["customer"]: e });
    };
    const handleProductChange = (e) => {
        setFormData({ ...formsData, ["product"]: e });
    };

    const handleReset = () => {
        setFormData({ pName: '', cName: '' });
        setFormData({ ...formsData, ["customer"]: '', ['product']: '' });
        handleProductChange('');
        handleCustomerChange('');
    };

    const handleChange = (chips) => {
        setFormData((prev) => ({ ...prev, materials: chips }));
    };

    console.log("formsData", formsData)

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
                        <ProductSpellSearch onChangeAction={handleProductChange} value={formsData.product} onReset={handleReset} />
                    </Grid>
                    <Grid item xs={6}>
                        <UnitSelect onChange={handleInputChange} value={formsData.unit} readOnly={readOnly} />
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
                            error={errors.qty} helperText={errors.qty}

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
                            size='small'
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
                    <Grid item xs={12}>
                        <Typography variant='h6'>Raw Material Details</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <MuiChipsInput
                            label="Add Raw Materials"
                            value={formsData.materials}
                            onChange={handleChange}
                            variant="outlined"
                            placeholder="Type and press enter materials..."
                            fullWidth
                            className={classes.root}
                            chipProps={{
                                className: classes.chip,
                            }}
                            InputProps={{
                                readOnly: readOnly,
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth id="material Quantity"
                            onChange={handleInputChange}
                            name='mqty'
                            label="Material Quantity"
                            variant='outlined'
                            size='small'
                            value={formsData.mqty}>
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Material Price"
                            variant="outlined"
                            fullWidth
                            size='small'
                            name='mPrice'
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            value={formsData.mPrice}
                            placeholder="Enter Material Price..."
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth id="Rejection Quantity"
                            onChange={handleInputChange}
                            name='rqty'
                            label="Rejection Quantity"
                            variant='outlined'
                            size='small'
                            value={formsData.rqty}>
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Rejection Price"
                            variant="outlined"
                            fullWidth
                            size='small'
                            name='rPrice'
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            value={formsData.rPrice}
                            placeholder="Enter Rejection Price..."
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth id="Lumps Quantity"
                            onChange={handleInputChange}
                            name='lqty'
                            label="Lumps Quantity"
                            variant='outlined'
                            size='small'
                            value={formsData.lqty}>
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Lumps Price"
                            variant="outlined"
                            fullWidth
                            size='small'
                            name='lPrice'
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            value={formsData.lPrice}
                            placeholder="Enter Lumps Price..."
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

export default ProductionAction;