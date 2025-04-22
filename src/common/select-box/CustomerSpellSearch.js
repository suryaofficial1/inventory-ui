import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { CUSTOMERS_LIST } from '../../config/api-urls';
import { useLoader } from '../../hooks/useLoader';
import { sendGetRequest } from '../../utils/network';
import { useSelector } from 'react-redux';

const CustomerSpellSearch = ({ onChange, value }) => {
    const [customers, setCustomers] = useState([]);
    const [{ start, stop }, Loader] = useLoader();
    const user = useSelector((state) => state.user);

    useEffect(() => {
        getCustomers();
    }, []);

    const getCustomers = async () => {
        start();
        try {
            const res = await sendGetRequest(CUSTOMERS_LIST, user.token);
            if (res.status === 200) {
                setCustomers(res.data);
            } else {
                console.error("Error fetching customer :", res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            stop();
        }
    };

    const handleSelection = (event, newValue) => {
        onChange(newValue ? newValue : '');
    };

    return (
        <>
            <Loader />
            <Autocomplete
                fullWidth
                disableClearable
                size="small"
                value={value || null}
                options={customers}
                onChange={handleSelection}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select customer..."
                        variant="outlined"
                        size="small"
                        placeholder='Search customer'
                    />
                )}
            />
        </>
    );
};

export default CustomerSpellSearch;
