import { Grid, TextField } from '@material-ui/core';
import React from 'react';

const PurchaseFilter = ({ filter, setFilter, reset }) => {
    const handleChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
                <TextField
                    size="small"
                    label="Product Code"
                    variant="outlined"
                    fullWidth
                    name="pName"
                    value={filter.pName}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    size="small"
                    label="Supplier Name"
                    variant="outlined"
                    fullWidth
                    name="sName"
                    value={filter.sName}
                    onChange={handleChange}
                />
            </Grid>
        </Grid>
    );
};

export default PurchaseFilter;