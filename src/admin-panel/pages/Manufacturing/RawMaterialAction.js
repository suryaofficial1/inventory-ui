import { Button, Collapse, Grid, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PurchaseProductSelect from '../../../common/select-box/PurchaseProductSelect';
import { ADD_MATERIAL_DETAILS, AVAILABLE_PURCHASE_PRODUCT_QTY, MATERIAL_LIST, UPDATE_MATERIAL_DETAILS } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { showMessage } from '../../../utils/message';
import { sendGetRequest, sendPostRequest } from '../../../utils/network';
import { validateNumber } from '../../../utils/validation';
import UsedMaterialDetails from './UsedMaterialDetails';

const RawMaterialAction = ({ productionId, readOnly = false, getProductionDetails }) => {
    const [formsData, setFormData] = useState(() => ({
        product: '',
        mqty: '',
        mPrice: '',
        rqty: '',
        rPrice: '',
        lqty: '',
        lPrice: '',
    }));
    const [edit, setEdit] = useState(false);
    const [selectedData, setSelectedData] = useState(false);

    const [availableQty, setAvailableQty] = useState(0);
    const [errors, setErrors] = useState({});
    const [rows, setRows] = useState([]);
    const [{ start, stop }, Loader] = useLoader();
    const user = useSelector((state) => state.user);


    useEffect(() => {
        if (productionId) {
            getMaterials()
        }

    }, [productionId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "mqty") {
            const numericValue = Number(value);
            const qtyValidation = validateNumber("Quantity", value);
            if (qtyValidation.error) {
                setErrors({ ...errors, ["mqty"]: qtyValidation.message });
                return;
            }
            if (!formsData.product) {
                showMessage("error", "Product selection is required before entering quantity!");
                return;
            }

            if (numericValue > availableQty) {
                setErrors({ ...errors, ["mqty"]: `Quantity cannot exceed available stock: ${availableQty}` });
                return;
            }
            setErrors({ ...errors, ["mqty"]: "" });
            setFormData((prev) => ({
                ...prev,
                [name]: numericValue,
            }));
        } else if (name === "rqty") {
            const qtyValidation = validateNumber("Quantity", value);
            if (qtyValidation.error) {
                setErrors({ ...errors, ["rqty"]: qtyValidation.message });
                return;
            }
            if (!formsData.mqty) {
                setErrors({ ...errors, ["mqty"]: 'First insert material quantity', ["rqty"]: 'Material Quantity is required' });
                return;
            }
            if (value > (availableQty - Number(formsData.mqty))) {
                setErrors({ ...errors, ["rqty"]: `Rejection Quantity cannot exceed available stock: ${availableQty - Number(formsData.mqty)}` });
                return;
            }

            setErrors({ ...errors, ["mqty"]: "", ["rqty"]: "" });
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));

        }
        else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    useEffect(() => {
        if (formsData.product.id) {
            getAvailableQty();
        }
    }, [formsData.product.id]);


    const getAvailableQty = async () => {
        try {
            const res = await sendGetRequest(AVAILABLE_PURCHASE_PRODUCT_QTY(formsData.product.id), user.token);
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

    const handleProductChange = (e) => {
        setFormData({ ...formsData, ["product"]: e, ['mqty']: '', ['mPrice']: '', ['rqty']: '', ['rPrice']: '', ['lqty']: '', ['lPrice']: '' });
    };

    const handleReset = () => {
        setFormData({ pName: '', cName: '' });
        setFormData({ ...formsData, ["customer"]: '', ['product']: '' });
        handleProductChange('');
        handleCustomerChange('');
    };

    const validation = () => {
        const errors = {};
        if (!formsData.product && formsData.product.id) errors.product = "Product is required";
        if (!formsData.mqty) errors.mqty = "Material Quantity is required";
        if (!formsData.mPrice) errors.mPrice = "Material Price is required";
        // if (!formsData.rqty) errors.rqty = "Rejection Quantity is required";
        // if (!formsData.rPrice) errors.rPrice = "Rejection Price is required";
        // if (!formsData.lqty) errors.lqty = "Lumps Quantity is required";
        // if (!formsData.lPrice) errors.lPrice = "Lumps Price is required";
        if (Object.keys(errors).length > 0) {
            showMessage("error", errors[Object.keys(errors)[0]]);
            return true;
        }
        return false;
    }

    const submitAction = () => {
        if (validation()) return;
        const reqData = {
            productionId,
            product: formsData.product.id,
            mqty: formsData.mqty,
            mPrice: formsData.mPrice,
            rqty: formsData.rqty,
            rPrice: formsData.rPrice,
            lqty: formsData.lqty,
            lPrice: formsData.lPrice,
        }
        const url = formsData.id ? UPDATE_MATERIAL_DETAILS(formsData.id) : ADD_MATERIAL_DETAILS;
        const action = formsData.id ? 'updated' : 'added';
        start()
        sendPostRequest(url, reqData, true, user.token).then((res) => {
            if (res.status === 200) {
                setFormData({
                    product: '',
                    mqty: '',
                    mPrice: '',
                    rqty: '',
                    rPrice: '',
                    lqty: '',
                    lPrice: '',
                });
                setErrors({})
                getMaterials()
                getProductionDetails(productionId)
                showMessage('success', `Material details successfully ${action}`);
            } else if (res.status === 400) {
                showMessage('error', res.data);
            } else if (res.status === 409) {
                showMessage('error', res.message);
            } else {
                showMessage('error', "Something went wrong in " + action + " material details!");
            }
        }).catch((err) => {
            console.log(err);
            showMessage('error', "Something went wrong in " + action + " material details!");
        }).finally(() => stop())
    }

    const getMaterials = () => {
        start()
        sendGetRequest(MATERIAL_LIST(productionId), user.token).then((res) => {
            if (res.status === 200) {
                setRows(res.data)
            } else if (res.status === 400) {
                showMessage('error', res.data);
            } else {
                showMessage('error', "Something went wrong while loading materials!");
            }
        }).catch((err) => {
            console.log(err);
            showMessage('error', "Something went wrong while loading materials!");
        }).finally(() => stop())
    }

    const editAction = (row) => {
        setEdit(!edit)
        setSelectedData(row);
        setFormData(row);
    }
    return (<>
        <Grid container spacing={1} item xs={12}>
            <Grid item xs={12}>
                <Typography gutterBottom variant='h6'>Add {rows?.length > 0 ? ' More ' : ''} Used Raw Material Detail</Typography>
            </Grid>
            <Grid item xs={12}>
                <PurchaseProductSelect onChangeAction={handleProductChange} value={formsData.product} onReset={handleReset} />
            </Grid>
            <Grid item xs={6}>
                <TextField fullWidth id="material Quantity"
                    onChange={handleInputChange}
                    name='mqty'
                    label="Material Quantity"
                    variant='outlined'
                    size='small'
                    value={formsData.mqty}
                    error={Boolean(errors.mqty)}
                    helperText={errors.mqty}
                />
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
                    value={formsData.rqty}
                    error={Boolean(errors.rqty)}
                    helperText={errors.rqty}
                >
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
            {!readOnly && <Grid item xs={12} >
                <Button variant="contained" color="primary" onClick={submitAction} >{rows?.length > 0 ? 'Add More' : 'Add'}</Button>
            </Grid>}

            <Grid item xs={12}>
                {rows?.length > 0 && <Collapse in={true} timeout="auto" unmountOnExit>
                    <UsedMaterialDetails editAction={editAction} data={rows} />
                </Collapse>}
            </Grid>
        </Grid>

    </>
    );
}

export default RawMaterialAction;
