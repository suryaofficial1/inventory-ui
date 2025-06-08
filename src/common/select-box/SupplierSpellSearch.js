import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { SUPPLIERS_LIST } from '../../config/api-urls';
import { useLoader } from '../../hooks/useLoader';
import { sendGetRequest } from '../../utils/network';
import { useSelector } from 'react-redux';

const SupplierSpellSearch = ({ onChange, value, error }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [{ start, stop }, Loader] = useLoader();
      const user = useSelector((state) => state.user);
    

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        start();
        try {
            const res = await sendGetRequest(SUPPLIERS_LIST, user.token);
            if (res.status === 200) {
                setSuppliers(res.data);
            } else {
                console.error("Error fetching suppliers :", res.data);
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
                options={suppliers}
                onChange={handleSelection}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Supplier..."
                        variant="outlined"
                        size="small"
                        error={Boolean(error)}
                        helperText={error ? "Supplier is required!" : ""}
                    />
                )}
            />
        </>
    );
};

export default SupplierSpellSearch;
