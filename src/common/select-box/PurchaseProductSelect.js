import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { PURCHASE_PRODUCTS_LIST } from '../../config/api-urls';
import { useLoader } from '../../hooks/useLoader';
import { sendGetRequest } from '../../utils/network';
import { useSelector } from 'react-redux';
import { Refresh } from '@material-ui/icons';

const PurchaseProductSelect = ({ onChangeAction, value }) => {
    const [products, setProducts] = useState([]);
    const [{ start, stop }, Loader] = useLoader();
    const user = useSelector((state) => state.user);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        start();
        try {
            const res = await sendGetRequest(PURCHASE_PRODUCTS_LIST, user.token);
            if (res.status === 200) {
                setProducts(res.data);
            } else {
                console.error("Error fetching purchase products:", res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            stop();
        }
    };

    const handleSelection = (event, newValue) => {
        onChangeAction(newValue);
    };

    return (
        <>
            <Loader />
            <Autocomplete
                fullWidth
                disableClearable
                selectOnFocus
                size="small"
                value={value || null}
                options={products}
                onChange={handleSelection}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select product..."
                        variant="outlined"
                        size="small"
                        // InputProps={{
                        //      ...params.inputProps,
                        //     endAdornment: <Refresh onClick={getProducts}  style={{ cursor: 'pointer' }}/>,
                        // }}
                        placeholder='Enter min 3 char of product name ...'
                    />
                )}
            />
        </>
    );
};

export default PurchaseProductSelect;
