import { Grid } from '@material-ui/core';
import SalesProductSpellSearch from '../../../common/input-search/SalesProductSpellSearch';
import CustomerSpellSearch from '../../../common/select-box/CustomerSpellSearch';
import React from 'react';

const SalesFilter = ({ filter, setFilter, reset, clearSignal }) => {

    const handleCustomerChange = (e) => {
        setFilter({ ...filter, "cName": e });
    };
    const handleProductChange = (e) => {
        setFilter({ ...filter, "pName": e.product });
    };

    const handleReset = () => {
        setFilter({ pName: null, cName: '' });
        handleProductChange('');
        handleCustomerChange('')
        reset();
    };

    return (
        <Grid container spacing={1} alignItems="center" alignContent='center'>
            <Grid item xs={12} sm={6}>
                <CustomerSpellSearch onChange={handleCustomerChange} value={filter.cName} onReset={handleReset} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <SalesProductSpellSearch onSelect={handleProductChange}
                    clearSignal={clearSignal} />
            </Grid>
        </Grid>
    );
};

export default SalesFilter;
