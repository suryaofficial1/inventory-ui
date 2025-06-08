import { Grid, MenuItem, TextField } from '@material-ui/core';
import ProductSpellSearch from '../../../common/input-search/ProductSpellSearch';
import React from 'react';


const ProductFilter = ({ filter, setFilter, reset, clearSignal }) => {

    const handleChange = (value) => {
        setFilter({ ...filter, productId: value.id });
    };
    const handleTypeChange = (e) => {
        console.log(e.target.value)
        setFilter({ ...filter, type: e.target.value });
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth id="type"
                    onChange={handleTypeChange}
                    name='type'
                    label="Product type"
                    variant='outlined'
                    size='small'
                    value={filter.type} select>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="purchase">Purchase</MenuItem>
                    <MenuItem value="sales">Sales</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
                <ProductSpellSearch
                    type={filter.type}
                    onSelect={(id) => handleChange(id)}
                    clearSignal={clearSignal}
                />
            </Grid>
        </Grid>
    );
};

export default ProductFilter;
