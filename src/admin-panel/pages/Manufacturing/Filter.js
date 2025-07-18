import { Grid } from '@material-ui/core';
import React from 'react';
import CustomerSpellSearch from '../../../common/select-box/CustomerSpellSearch';
import ProductionProductSelect from '../../../common/select-box/ProductionProductSelect';
import PurchaseItemsSpellSearch from '../../../common/input-search/PurchaseItemsSpellSearch';
import ProductionProductSpellSearch from '../../../common/input-search/ProductionProductSpellSearch';

const Filter = ({ filter, setFilter, reset, clearSignal }) => {

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
                <ProductionProductSpellSearch
                    onSelect={handleProductChange}
                    clearSignal={clearSignal}
                    status="all"
                    />
            </Grid>
        </Grid>
    );
};

export default Filter;
