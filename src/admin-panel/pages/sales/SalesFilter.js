import { Grid, TextField } from '@material-ui/core';
import React from 'react';

const SalesFilter = (props) => {
    const handleChange = (e) => {
        props.setFilter({ ...props.filter, [e.target.name]: e.target.value });
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
                <TextField
                    size="small"
                    label="Customer Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="cName"
                    value={props.filter.cName}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    size="small"
                    label="Product Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="pName"
                    value={props.filter.pName}
                    onChange={handleChange}
                />
            </Grid>
        </Grid>
    );
};

export default SalesFilter;
