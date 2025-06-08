import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PURCHASE_RETURN_LIST_BY_PRODUCTS } from '../../config/api-urls';
import { useLoader } from '../../hooks/useLoader';
import { sendGetRequest } from '../../utils/network';

const SpellSearchPurchase = ({ onChangeAction, value, type }) => {
    const [products, setProducts] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [{ start, stop }, Loader] = useLoader();
    const user = useSelector((state) => state.user);
    useEffect(() => {
        if (!inputValue) {
            setProducts([]);
            return;
        }

        const delayDebounce = setTimeout(() => {
            fetchProducts(inputValue);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [inputValue]);

    const fetchProducts = async (keyword) => {
        start();
        try {
            const res = await sendGetRequest(`${PURCHASE_RETURN_LIST_BY_PRODUCTS}?type=${type}&product=${keyword}`, user.token);
            if (res.status === 200) {
                setProducts(res.data);
            } else {
                console.error("Error fetching products:", res.data);
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
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                options={products}
                onChange={handleSelection}
                noOptionsText="No products found"
                getOptionLabel={(option) => option?.name || ""}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select product..."
                        variant="outlined"
                        size="small"
                        placeholder="Search product..."
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: 'off',
                        }}
                    />
                )}
            />
        </>
    );
};

export default SpellSearchPurchase;
