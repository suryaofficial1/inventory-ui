import { Button, Collapse, Grid, MenuItem, TextField } from '@material-ui/core'
import moment from 'moment'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import PopupAction from '../../../common/PopupAction'
import CustomerSpellSearch from '../../../common/select-box/CustomerSpellSearch'
import UnitSelect from '../../../common/select-box/UnitSelect'
import { ADD_PRODUCTION_DETAILS, PRODUCTION_DETAIL_BY_ID, PRODUCTION_DETAIL_BY_PRODUCT_ID, UPDATE_PRODUCTION_DETAILS, UPDATE_PRODUCTION_STATUS } from '../../../config/api-urls'
import { useLoader } from '../../../hooks/useLoader'
import { showMessage } from '../../../utils/message'
import { sendGetRequest, sendPostRequest } from '../../../utils/network'
import { validateNumber } from '../../../utils/validation'
import NewProductionDetails from './NewProductionDetails'
import RawMaterialAction from './RawMaterialAction'
import UsedMaterialDetails from './UsedMaterialDetails'
import SpellSearchProduct from '../../../common/select-box/SpellSearchProduct'
import PurchaseItemsSpellSearch from '../../../common/input-search/PurchaseItemsSpellSearch'
import ProductSpellSearch from '../../../common/input-search/ProductSpellSearch'


const ProductionAction = ({ successAction, title, selectedData = {}, readOnly = false, onClose }) => {
    const [formsData, setFormData] = useState(() => ({
        customer: selectedData?.customer ? selectedData.customer : '' || '',
        pDate: moment(selectedData.pDate).local().format('YYYY-MM-DD') || '',
        product: selectedData?.product ? selectedData.product : '' || '',
        unit: selectedData.unit || '',
        qty: selectedData.qty || '',
        operatorName: selectedData.operatorName || '',
        pDesc: selectedData.pDesc || '',
        status: selectedData.status || '0',
        productionId: selectedData.id || '',
        batchNo: selectedData.batchNo || '',
    }));
    const [productionData, setProductionData] = useState({});
    const [clearSignal, setClearSignal] = useState(0);
    const [errors, setErrors] = useState({});
    const [edit, setEdit] = useState(false);
    const [{ start, stop }, Loader] = useLoader();
    const user = useSelector((state) => state.user);

console.log("formsData", formsData)
    const getProductionDetailsByProductId = (e) => {
        start();
        sendGetRequest(PRODUCTION_DETAIL_BY_PRODUCT_ID(e.id, formsData.batchNo), user.token).then((res) => {
            if (res.status === 200) {
                if (Object.keys(res.data).length !== 0){
                    setClearSignal((prev) => prev + 1);
                    setFormData((prev) => ({ ...prev, product: {}, unit: "" }));
                    showMessage('error', `Same product already exists on ${res.data.batchNo} batch Number`);
                } else {
                setFormData((prev) => ({ ...prev, product: e, unit: e.unit }));
                }
            }
        }).catch((err) => {
            console.log("err", err);
        }).finally(() => {
            stop();
        });
    }

    const handleInputChange = (e) => {
        if (typeof e === "object" && e?.id) {
            if (formsData.batchNo == '' || formsData.batchNo.trim() == '') {
                setClearSignal((prev) => prev + 1);
                setFormData((prev) => ({ ...prev, product: {}, unit: "" }));
                setErrors({ ...errors, ["batchNo"]: "Batch No is required" });
                showMessage('error', "Please enter batch no before selecting product.");
                return;
            }
            getProductionDetailsByProductId(e);
            return;
        }
        const { name, value } = e.target;
        if (name === "qty") {

            const qtyValidation = validateNumber("Quantity", value);
            if (qtyValidation.error) {
                setErrors({ ...errors, ["qty"]: qtyValidation.message });
                return;
            } else {
                setErrors({ ...errors, ["qty"]: '' });
                setFormData((prev) => ({ ...prev, ["qty"]: value }));
            }
        } 
         if (name === "batchNo") {
            setClearSignal((prev) => prev + 1);
             setFormData((prev) => ({ ...prev, product: {}, unit: "" }));
            setErrors({ ...errors, ["batchNo"]: '' });
            setFormData((prev) => ({ ...prev, [name]: value }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validation = () => {
        const errors = {};
        if (!formsData.customer) errors.customer = "Customer is required";
        if (!formsData.batchNo) errors.batchNo = "Batch No is required";
        if (!formsData.pDate) errors.pDate = "Manufacturing Date is required";
        if (!formsData.product) errors.product = "Product is required";
        if (!formsData.unit) errors.unit = "Unit is required";
        if (!formsData.qty) errors.qty = "Quantity is required";
        if (!formsData.operatorName) errors.operatorName = "Operator name is required";
        if (!formsData.pDesc) errors.pDesc = "Description name is required";
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
            batchNo: formsData.batchNo,
            manufacturingDate: formsData.pDate,
            product: formsData.product.id,
            unit: formsData.unit,
            qty: formsData.qty,
            operatorName: formsData.operatorName,
            pDesc: formsData.pDesc,
            status: formsData.status,
        }
        const url = selectedData.id ? UPDATE_PRODUCTION_DETAILS(selectedData.id) : ADD_PRODUCTION_DETAILS;
        const action = selectedData.id ? 'updated' : 'added';
        start()
        sendPostRequest(url, reqData, true, user.token).then((res) => {
            if (res.status === 200) {
                getProductionDetails(res.data.insertId)
                showMessage('success', `Production details successfully ${action}`);
                setTimeout(() => {
                    setFormData(prev => ({ ...prev, ["productionId"]: res.data.insertId }))
                    setEdit(!edit)
                }, 1000)

            } else if (res.status === 400) {
                showMessage('error', res.data);
            } else {
                showMessage('error', "Something went wrong in " + action + " production details!");
            }
        }).catch((err) => {
            console.log(err);
            showMessage('error', "Something went wrong in " + action + " production details!");
        }).finally(() => stop())
    }

    const getProductionDetails = (id) => {
        start()
        sendGetRequest(PRODUCTION_DETAIL_BY_ID(id), user.token).then((res) => {
            if (res.status === 200) {
                setProductionData(res.data)
            } else if (res.status === 400) {
                showMessage('error', res.data);
            } else {
                showMessage('error', "Something went wrong while loading production details!");
            }
        }).catch((err) => {
            console.log(err);
            showMessage('error', "Something went wrong while loading production details!");
        }).finally(() => stop())
    }

    const finalSubmit = () => {
        start()
        sendPostRequest(UPDATE_PRODUCTION_STATUS(productionData.id), { status: 1 }, true, user.token).then((res) => {
            if (res.status === 200) {
                successAction()
                showMessage('success', `Production details successfully submit`);
                onClose();
            } else if (res.status === 400) {
                showMessage('error', res.data);
            } else {
                showMessage('error', "Something went wrong in final submit production details!");
            }
        }).catch((err) => {
            console.log(err);
            showMessage('error', "Something went wrong in final submit production details!");
        }).finally(() => stop())
    }


    const handleCustomerChange = (e) => {
        setFormData({ ...formsData, ["customer"]: e });
    };

    const handleReset = () => {
        setFormData({ ...formsData, ["customer"]: '', });
        handleCustomerChange('');
    };

    const actionForm = () => {
        return (
            <Grid container spacing={2} style={{ padding: 20 }}>
                <Grid item xs={6}>
                    <CustomerSpellSearch onChange={handleCustomerChange} value={formsData.customer} onReset={handleReset} />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        name="batchNo"
                        value={formsData.batchNo}
                        onChange={handleInputChange}
                        label="Batch Number"
                        size='small'
                        error={errors.batchNo ? true : false}
                        helperText={errors.batchNo}
                    />
                </Grid>
                <Grid item xs={12}>
                    {selectedData.id ?
                        <TextField label="Product Name" variant="outlined" fullWidth name='product' size='small' value={formsData.product.name} placeholder="Enter Product Name..." InputProps={{ readOnly: true }} />
                        :
                        <ProductSpellSearch
                            type="sales"
                            onSelect={(e) => handleInputChange(e)}
                            clearSignal={clearSignal}
                        />
                    }
                </Grid>
                <Grid item xs={6}>
                    <UnitSelect onChange={handleInputChange} value={formsData.unit} readOnly={readOnly} />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        name="pDate"
                        value={formsData.pDate}
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
                {!readOnly && <Grid item xs={12} >
                    <Button variant="contained" color="primary" onClick={submitAction} >{selectedData.id ? "Update" : "Submit"}</Button>
                </Grid>}
            </Grid>
        )
    }

    return (
        <>
            <Loader />
            <PopupAction onClose={onClose} title={title} width={900}
                actions={productionData.id && productionData.materialCount != 0 && (
                    <Button variant="contained" color="primary" onClick={finalSubmit}>
                        Final Save
                    </Button>)
                }
            >
                <Grid container spacing={2} style={{ padding: 20 }}>
                    <Collapse in={!productionData.id || !edit} timeout="auto" unmountOnExit>
                        {actionForm()}
                    </Collapse>
                    {!readOnly ? <Collapse in={productionData.id && edit} timeout="auto" unmountOnExit>
                        <Grid container item xs={12} spacing={2}>
                            <Grid item xs={12} >
                                <NewProductionDetails data={productionData} />
                            </Grid>
                            <Grid item xs={12} spacing={1}>
                                <RawMaterialAction productionId={productionData.id} readOnly={readOnly} getProductionDetails={getProductionDetails} />
                            </Grid>
                        </Grid>
                    </Collapse> :
                        <Grid item xs={12}>
                            {selectedData && selectedData.materials.length != 0 &&
                                <UsedMaterialDetails data={selectedData.materials} readOnly={readOnly} />
                            }
                        </Grid>
                    }
                </Grid>
            </PopupAction >
        </>
    )
}

export default ProductionAction;