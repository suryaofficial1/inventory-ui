import { Grid } from '@material-ui/core';
import React from 'react';
import CustomerSpellSearch from '../../../common/select-box/CustomerSpellSearch';

const Filter = ({ filter, setFilter, reset }) => {

    const handleChange = (value) => {
        setFilter({ ...filter, name: value });
    };

    const handleReset = () => {
        setFilter({ name: '' });
        handleChange('');
        reset();
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
                <CustomerSpellSearch onChange={handleChange} value={filter.name} onReset={handleReset} />
            </Grid>
        </Grid>
    );
};

export default Filter;
