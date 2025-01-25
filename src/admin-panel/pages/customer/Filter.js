import { Grid, TextField } from '@material-ui/core';
import React from 'react';

const Filter = (props) => {
    const handleChange = (e) => {
        props.setFilter({ ...props.filter, [e.target.name]: e.target.value });
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
                <TextField
                    size="small"
                    label="Customer Code"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="cCode"
                    value={props.filter.cCode}
                    onChange={handleChange}
                />
            </Grid>

            <Grid item xs={12} sm={4}>
                <TextField
                    size="small"
                    label="GSTIN"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="gstin"
                    value={props.filter.gstin}
                    onChange={handleChange}
                />
            </Grid>
        </Grid>
    );
};

export default Filter;
