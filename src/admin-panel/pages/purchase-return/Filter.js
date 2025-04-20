import { Grid } from '@material-ui/core';
import React from 'react';
import ProductSpellSearch from '../../../common/select-box/ProductSpellSearch';
import SupplierSpellSearch from '../../../common/select-box/SupplierSpellSearch';

const PurchaseFilter = ({ filter, setFilter, reset }) => {

    const handleSupplierChange = (e) => {
        setFilter({ ...filter, "sName": e });
    };
    const handleProductChange = (e) => {
        setFilter({ ...filter, "pName": e });
    };

    const handleReset = () => {
        setFilter({ pName: '', sName: '' });
        handleProductChange('');
        handleSupplierChange('')
        reset();
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
                <SupplierSpellSearch onChange={handleSupplierChange} value={filter.sName} onReset={handleReset} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <ProductSpellSearch type="purchase" onChangeAction={handleProductChange} value={filter.pName} onReset={handleReset} />
            </Grid>
        </Grid>
    );
};

export default PurchaseFilter;