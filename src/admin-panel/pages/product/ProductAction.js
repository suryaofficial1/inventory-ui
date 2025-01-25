import { Button, Grid, MenuItem, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import PopupAction from '../../../common/PopupAction'
import { ADD_PRODUCT, UPDATE_PRODUCT } from '../../../config/api-urls'
import { useLoader } from '../../../hooks/useLoader'
import { showMessage } from '../../../utils/message'
import { sendPostRequest } from '../../../utils/network'

const ProductAction = ({ onClose, successAction, title, selectedData = {}, readOnly = false }) => {
    const [formsData, setFormData] = useState(() => ({
        name: selectedData.name || '',
        description: selectedData.description || '',
        qty: selectedData.qty || '',
        price: selectedData.price || '',
        unit: selectedData.unit || '',
        status: selectedData.status || '1',
    }));

    const [{ start, stop }, Loader] = useLoader();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validation = () => {
        const errors = {};
        if (!formsData.name) errors.name = "Name is required";
        if (!formsData.description) errors.description = "Description is required";
        if (!formsData.qty) errors.qty = "Quantity is required";
        if (!formsData.price) errors.price = "Price is required";
        if (!formsData.unit) errors.unit = "Unit is required";
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
            name: formsData.name,
            description: formsData.description,
            qty: formsData.qty,
            price: formsData.price,
            unit: formsData.unit,
            status: formsData.status,
        }
        const url = selectedData.id ? UPDATE_PRODUCT(selectedData.id) : ADD_PRODUCT;
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
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            size='small'
                            name='name'
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            value={formsData.name}
                            placeholder="Enter Name..."
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Price"
                            variant="outlined"
                            fullWidth
                            name='price'
                            size='small'
                            value={formsData.price}
                            placeholder="Enter Price..."
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
                            name='description'
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            value={formsData.description}
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

export default ProductAction;