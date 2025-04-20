import { Grid } from '@material-ui/core';
import React from 'react';
import CustomerSpellSearch from '../../../common/select-box/CustomerSpellSearch';
import ProductionProductSelect from '../../../common/select-box/ProductionProductSelect';

const Filter = ({ filter, setFilter, reset }) => {

    const handleCustomerChange = (e) => {
        setFilter({ ...filter, "cName": e });
    };
    const handleProductChange = (e) => {
        setFilter({ ...filter, "pName": e });
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
                <ProductionProductSelect onChangeAction={handleProductChange} value={filter.pName} onReset={handleReset} />
            </Grid>
        </Grid>
    );
};

export default Filter;
