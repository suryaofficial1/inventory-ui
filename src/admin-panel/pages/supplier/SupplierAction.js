import { Button, Grid, MenuItem, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import PopupAction from '../../../common/PopupAction'
import { ADD_SUPPLIER, UPDATE_SUPPLIER } from '../../../config/api-urls'
import { useLoader } from '../../../hooks/useLoader'
import { showMessage } from '../../../utils/message'
import { sendPostRequest } from '../../../utils/network'
import { validateGSTNumber } from '../../../utils/validation'
import { useSelector } from 'react-redux'

const SupplierAction = ({ onClose, successAction, title, selectedData = {}, readOnly = false }) => {
    const [formsData, setFormData] = useState(() => ({
        name: selectedData.name || '',
        vendorCode: selectedData.vendorCode || '',
        address: selectedData.address || '',
        location: selectedData.location || '',
        contact: selectedData.contact || '',
        gstin: selectedData.gstin || '',
        status: selectedData.status || '1',
    }));
    const [errors, setErrors] = useState({});
    const user = useSelector((state) => state.user);

    const [{ start, stop }, Loader] = useLoader();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const gstNumberHandle = (e) => {
        const value = e.target.value;
        const gstValue = validateGSTNumber(value);
        if (gstValue.error) {
            setErrors({ ...errors, ["gstin"]: gstValue.message });
        } else {
            setErrors({ ...errors, ["gstin"]: '' });
            setFormData((prev) => ({ ...prev, ['gstin']: value }));
        }
    }

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        const numericValue = Number(value);
        if (isNaN(numericValue)) return;
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
    }

    const validation = () => {
        const errors = {};
        if (!formsData.name) errors.name = "Name is required";
        if (!formsData.vendorCode) errors.vendorCode = "Vendor Code is required";
        if (!formsData.address) errors.address = "Address is required";
        if (!formsData.location) errors.location = "Location is required";
        if (!formsData.contact) errors.contact = "Contact is required";
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
            vendorCode: formsData.vendorCode,
            address: formsData.address,
            location: formsData.location,
            contact: formsData.contact,
            gstin: formsData.gstin,
            status: formsData.status,
        }
        const url = selectedData.id ? UPDATE_SUPPLIER(selectedData.id) : ADD_SUPPLIER;
        const action = selectedData.id ? 'updated' : 'added';
        start()
        sendPostRequest(url, reqData, true).then((res) => {
            if (res.status === 200) {
                successAction()
                showMessage('success', `Supplier successfully ${action}`);
                onClose();
            } else if (res.status === 400) {
                showMessage('error', res.data);
            } else if (res.status === 409) {
                showMessage('error', res.message);
            } else {
                showMessage('error', "Something went wrong in " + action + " supplier!");
            }
        }).catch((err) => {
            console.log(err);
            showMessage('error', "Something went wrong in " + action + " supplier!");
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
                            autoComplete='off'
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
                            autoComplete='off'
                            label="Vendor Code"
                            variant="outlined"
                            fullWidth
                            size='small'
                            name='vendorCode'
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            value={formsData.vendorCode}
                            placeholder="Enter Vendor Code..."
                            onChange={handleInputChange}
                        />
                    </Grid>
                    
                    <Grid item xs={6}>
                        <TextField
                            autoComplete='off'
                            label="Contact"
                            variant="outlined"
                            fullWidth
                            name='contact'
                            size='small'
                            value={formsData.contact}
                            placeholder="Enter Contact..."
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            onChange={(e) => handleContactChange(e)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            autoComplete='off'
                            label="GSTIN"
                            variant="outlined"
                            fullWidth
                            name='gstin'
                            size='small'
                            value={formsData.gstin}
                            placeholder="Enter GSTIN..."
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            error={errors.gstin}
                            helperText={errors.gstin}
                            onChange={(e) => gstNumberHandle(e)}
                        />
                    </Grid>
                      <Grid item xs={12}>
                        <TextField
                            multiline
                            rows={2}
                            autoComplete='off'
                            label="Location"
                            variant="outlined"
                            fullWidth
                            name='location'
                            size='small'
                            value={formsData.location}
                            placeholder="Enter Location..."
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        multiline
                            rows={3}
                            autoComplete='off'
                            label="Address"
                            variant="outlined"
                            fullWidth
                            name='address'
                            size='small'
                            value={formsData.address}
                            placeholder="Enter Address..."
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            onChange={handleInputChange}
                        />
                    </Grid>
                  
                    <Grid item xs={12}>
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
                    </Grid>
                </Grid>
            </PopupAction >
        </>
    )
}

export default SupplierAction;