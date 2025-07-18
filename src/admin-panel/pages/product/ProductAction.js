import { Button, Grid, MenuItem, TextField } from '@material-ui/core'
import { useSelector } from 'react-redux'
import PopupAction from '../../../common/PopupAction'
import UnitSelect from '../../../common/select-box/UnitSelect'
import { ADD_PRODUCT, UPDATE_PRODUCT } from '../../../config/api-urls'
import { useLoader } from '../../../hooks/useLoader'
import { showMessage } from '../../../utils/message'
import { sendPostRequestWithAuth } from '../../../utils/network'
import React, { useState } from 'react'

const ProductAction = ({ onClose, successAction, selectedData = {}, readOnly = false }) => {
    const [formsData, setFormData] = useState(() => ({
        name: selectedData.name || '',
        description: selectedData.description || '',
        qty: selectedData.qty || '',
        price: selectedData.price || '',
        unit: selectedData.unit || '',
        type: selectedData.type || '',
        status: selectedData.status || '1',
    }));
    const user = useSelector((state) => state.user);
    const [{ start, stop }, Loader] = useLoader();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validation = () => {
        const errors = {};
        if (!formsData.name) errors.name = "Name is required";
        if (!formsData.unit) errors.unit = "Unit is required";
        if (!formsData.type) errors.type = "Type is required";
        if (Object.keys(errors).length > 0) {
            showMessage("error", errors[Object.keys(errors)[0]]);
            return true;
        }
        return false;
    }

    const submitAction = () => {
        if (validation()) return;
        const reqData = {
            name: formsData.name,
            description: formsData.description,
            qty: formsData.qty,
            price: formsData.price,
            unit: formsData.unit,
            type: formsData.type.toLowerCase(),
            status: formsData.status,
        }
        const url = selectedData.id ? UPDATE_PRODUCT(selectedData.id) : ADD_PRODUCT;
        const action = selectedData.id ? 'updated' : 'added';
        start()
        sendPostRequestWithAuth(url, reqData, user.token).then((res) => {
            if (res.status === 200) {
                successAction()
                showMessage('success', `Product successfully ${action}`);
                onClose();
            } else if (res.status === 400) {
                showMessage('error', res.message);
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
            <PopupAction onClose={onClose} title={readOnly ? "View Product Details" : selectedData.id ? 'Update Product' : 'Add Product'} width={700}
                actions={
                    !readOnly && (
                        <Button variant="contained" color="primary" onClick={submitAction}>
                            Save
                        </Button>
                    )
                }
            >
                <Grid container spacing={3} style={{ padding: 20 }}>
                    <Grid item xs={12}>
                        <TextField
                            autoComplete='off'
                            label="Product name"
                            variant="outlined"
                            fullWidth
                            name='name'
                            size='small'
                            value={formsData.name}
                            placeholder="Enter Product name..."
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete='off' fullWidth id="type"
                            onChange={handleInputChange}
                            name='type'
                            label="Type"
                            variant='outlined'
                            size='small'
                            value={formsData.type} select>
                            <MenuItem value="purchase">Purchase</MenuItem>
                            <MenuItem value="sales">Sales</MenuItem>

                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <UnitSelect onChange={handleInputChange} value={formsData.unit} readOnly={readOnly} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete='off'
                            label="Quantity"
                            variant="outlined"
                            fullWidth
                            name='qty'
                            type='number'
                            size='small'
                            value={formsData.qty}
                            placeholder="Enter Quantity..."
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete='off'
                            label="Price"
                            variant="outlined"
                            fullWidth
                            name='price'
                            size='small'
                            type='number'
                            value={formsData.price}
                            placeholder="Enter Price..."
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete='off' fullWidth id="status"
                            onChange={handleInputChange}
                            name='status'
                            label="Status"
                            variant='outlined'
                            size='small'
                            value={formsData.status} select>
                            <MenuItem value="1">Active</MenuItem>
                            <MenuItem value="0">Inactive</MenuItem>

                        </TextField>
                    </Grid> */}
                    <Grid item xs={12}>
                        <TextField
                            autoComplete='off'
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            size='small'
                            name='description'
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            value={formsData.description}
                            placeholder="Enter Description..."
                            onChange={handleInputChange}
                        />
                    </Grid>
                </Grid>
            </PopupAction >
        </>
    )
}

export default ProductAction;