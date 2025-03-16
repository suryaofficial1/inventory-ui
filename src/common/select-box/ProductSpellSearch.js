import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { PRODUCTS_LIST } from '../../config/api-urls';
import { useLoader } from '../../hooks/useLoader';
import { sendGetRequest } from '../../utils/network';

const ProductSpellSearch = ({ onChangeAction, value, onReset }) => {
    const [products, setProducts] = useState([]);
    const [{ start, stop }, Loader] = useLoader();

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        start();
        try {
            const res = await sendGetRequest(PRODUCTS_LIST);
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
        console.log("newval", newValue)
        onChangeAction(newValue);
    };

    return (
        <>
            <Loader />
            <Autocomplete
                fullWidth
                disableClearable
                size="small"
                value={value || null}
                options={products}
                onChange={handleSelection}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Product..."
                        variant="outlined"
                        size="small"
                    />
                )}
            />
        </>
    );
};

export default ProductSpellSearch;
