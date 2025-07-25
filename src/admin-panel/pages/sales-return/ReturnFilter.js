import { Grid } from '@material-ui/core';
import SalesReturnProductSpellSearch from '../../../common/input-search/SalesReturnProductSpellSearch';
import CustomerSpellSearch from '../../../common/select-box/CustomerSpellSearch';
import React from 'react';

const ReturnFilter = ({ filter, setFilter, reset ,clearSignal}) => {

    const handleCustomerChange = (e) => {
        setFilter({ ...filter, "cName": e });
    };
    const handleProductChange = (e) => {
        setFilter({ ...filter, "pName": e.product });
    };

    const handleReset = () => {
        setFilter({ pName: '', cName: '' });
        handleProductChange('');
        handleCustomerChange('')
        reset();
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
                <CustomerSpellSearch onChange={handleCustomerChange} value={filter.cName} onReset={handleReset} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <SalesReturnProductSpellSearch
                onSelect={handleProductChange}
                    clearSignal={clearSignal} />
            </Grid>
        </Grid>
    );
};

export default ReturnFilter;
