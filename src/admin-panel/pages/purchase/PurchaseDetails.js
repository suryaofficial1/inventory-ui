import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PURCHASE_LIST_BY_INVOICE_NO } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { showMessage } from '../../../utils/message';
import { sendGetRequest } from '../../../utils/network';

const PurchaseDetails = ({ error, setter }) => {
    const [open, setOpen] = useState(false);
    const [purchaseList, setPurchaseList] = useState([]);

    const loading = open && purchaseList.length === 0;
    const [{ start, stop }, isLoading] = useLoader(false);
    const { token } = useSelector(state => state.user)

    useEffect(() => {
        if (!open) {
            setPurchaseList([]);
        }
    }, [open]);

    const onEnterSearchUser = (e) => {
        if (e.keyCode === 13) {
            loadPurchaseDetails(e.target.value)
        }
    }

    const handleChange = (event, newValue) => {
        setter(newValue);
    };

    const loadPurchaseDetails = (data) => {
        start();
        sendGetRequest(`${PURCHASE_LIST_BY_INVOICE_NO}?invoiceNo=${data}`, token).then((_res) => {
            if (_res.status === 200) {
                console.log("details", _res.data)

                setPurchaseList(_res.data);
            } else if (_res.status === 400) {
                showMessage("error", _res.data[0]);
            } else {
                showMessage("error", "Something went wrong while loading purchase details");
            }
        }).catch(err => {
            console.log("err", err)
            showMessage("error", "Something went wrong while loading purchase details");
        }).finally(() => stop())
    }

    return (<>
        <Autocomplete
            size='small'
            fullWidth
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={purchaseList}
            onChange={(event, newValue) => handleChange(event, newValue)}
            getOptionLabel={(option) => option.invoiceNo}
            disableClearable
            loading={isLoading}
            renderInput={(params) => <TextField size='small'
                margin="dense" {...params}
                InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                        </>
                    ),
                }}
                error={error}
                helperText={error ? "Please select purchase" : ""}
                onKeyUp={onEnterSearchUser}
                label="Search purchase record" placeholder="Please Type min 3 char and press enter..." variant="outlined" />}
        />
    </>)
}

export default PurchaseDetails