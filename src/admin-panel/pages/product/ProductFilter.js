import { Grid, TextField } from '@material-ui/core';
import React from 'react';

const ProductFilter = (props) => {
    const handleChange = (e) => {
        props.setFilter({ ...props.filter, [e.target.name]: e.target.value });
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={3}>
                <TextField
                    size="small"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="name"
                    value={props.filter.name}
                    onChange={handleChange}
                />
            </Grid>
        </Grid>
    );
};

export default ProductFilter;
