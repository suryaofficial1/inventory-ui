import { Button, Grid, MenuItem, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import PopupAction from '../../../common/PopupAction'
import { ADD_CUSTOMER, UPDATE_CUSTOMER } from '../../../config/api-urls'
import { useLoader } from '../../../hooks/useLoader'
import { showMessage } from '../../../utils/message'
import { sendPostRequest } from '../../../utils/network'

const CustomerAction = ({ onClose, successAction, title, selectedData = {}, readOnly = false }) => {
    const [formsData, setFormData] = useState(() => ({
        name: selectedData.name || '',
        cCode: selectedData.cCode || '',
        address: selectedData.address || '',
        location: selectedData.location || '',
        contact: selectedData.contact || '',
        gstin: selectedData.gstin || '',
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
            address: formsData.address,
            location: formsData.location,
            contact: formsData.contact,
            gstin: formsData.gstin,
            status: formsData.status,
        }
        const url = selectedData.id ? UPDATE_CUSTOMER(selectedData.id) : ADD_CUSTOMER;
        const action = selectedData.id ? 'updated' : 'added';
        start()
        sendPostRequest(url, reqData, true).then((res) => {
            if (res.status === 200) {
                successAction()
                showMessage('success', `Customer successfully ${action}`);
                onClose();
            } else if (res.status === 400) {
                showMessage('error', res.data);
            } else if (res.status === 409) {
                showMessage('error', res.message);
            } else {
                showMessage('error', "Something went wrong in " + action + " customer!");
            }
        }).catch((err) => {
            console.log(err);
            showMessage('error', "Something went wrong in " + action + " customer!");
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
                    {formsData.cCode && <Grid item xs={6}>
                        <TextField
                            label="Customer Code"
                            variant="outlined"
                            fullWidth
                            size='small'
                            name='cCode'
                            InputProps={{
                                readOnly: true,
                            }}
                            value={formsData.cCode}
                            placeholder="Enter Customer Code..."
                            onChange={handleInputChange}
                        />
                    </Grid>}

                    <Grid item xs={6}>
                        <TextField
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
                    <Grid item xs={6}>
                        <TextField
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
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
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
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
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

export default CustomerAction;