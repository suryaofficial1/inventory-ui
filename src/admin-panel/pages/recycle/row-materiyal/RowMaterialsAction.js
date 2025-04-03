import { Button, Grid, MenuItem, TextField } from '@material-ui/core'
import { MuiChipsInput } from 'mui-chips-input'
import React, { useState } from 'react'
import PopupAction from '../../../../common/PopupAction'
import { ADD_MATERIYAL_DETAILS, UPDATE_MATERIYAL_DETAILS } from '../../../../config/api-urls'
import { useLoader } from '../../../../hooks/useLoader'
import { showMessage } from '../../../../utils/message'
import { sendPostRequest } from '../../../../utils/network'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiOutlinedInput-root": {
            padding: "10px",
            borderRadius: "15px", // Rounded input field
        },
    },
    chip: {
        backgroundColor: "#E0E0E0", // Light gray background
        color: "#000", // Black text
        fontWeight: "bold",
        padding: "6px 12px",
        borderRadius: "15px",
        margin: theme.spacing(0.5),
        "& .MuiChip-deleteIcon": {
            color: "#777",
            "&:hover": {
                color: "#000", // Darker color on hover
            },
        },
    },
}));


const RowMaterialsAction = ({ onClose, successAction, title, selectedData = {}, readOnly = false }) => {
    const classes = useStyles();

    const [formsData, setFormData] = useState(() => ({
        materials: selectedData?.materials && selectedData?.materials.length != 0 ?  JSON.parse(selectedData.materials) : [] || [],
        mqty: selectedData.mqty || '',
        mPrice: selectedData.mPrice || '',
        rqty: selectedData.rqty || '',
        rPrice: selectedData.rPrice || '',
        lqty: selectedData.lqty || '',
        lPrice: selectedData.lPrice || '',
        status: selectedData.status || '1',
    }));
    const [{ start, stop }, Loader] = useLoader();


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validation = () => {
        const errors = {};
        if (!formsData.materials && formsData.materials !== 0) errors.materials = "Minmuam one materials is required";
        if (!formsData.mqty) errors.mqty = "Materiyal Quantity is required";
        if (!formsData.mPrice) errors.mPrice = "Materiyal Price is required";
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

    console.log("materials" , selectedData, formsData.materials)

    const submitAction = () => {
        if (validation()) return;
        const reqData = {
            materials: formsData.materials,
            mqty: formsData.mqty,
            mPrice: formsData.mPrice,
            rqty: formsData.rqty,
            rPrice: formsData.rPrice,
            lqty: formsData.lqty,
            lPrice: formsData.lPrice,
            status: formsData.status,
        }
        const url = selectedData.id ? UPDATE_MATERIYAL_DETAILS(selectedData.id) : ADD_MATERIYAL_DETAILS;
        const action = selectedData.id ? 'updated' : 'added';
        start()
        sendPostRequest(url, reqData, true).then((res) => {
            if (res.status === 200) {
                successAction()
                showMessage('success', `Material details successfully ${action}`);
                onClose();
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

    const handleChange = (chips) => {
        setFormData((prev) => ({ ...prev, materials: chips }));
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
                    <Grid item xs={12}>
                        <MuiChipsInput
                            label="Materials"
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
                        <TextField fullWidth id="Materiyal Quantity"
                            onChange={handleInputChange}
                            name='mqty'
                            label="Materiyal Quantity"
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

export default RowMaterialsAction;