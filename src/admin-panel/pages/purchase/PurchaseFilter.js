import { Grid, TextField } from '@material-ui/core';
import React from 'react';
import SupplierSpellSearch from '../../../common/select-box/SupplierSpellSearch';
import ProductionProductSelect from '../../../common/select-box/ProductionProductSelect';
import PurchaseProductSelect from '../../../common/select-box/PurchaseProductSelect';

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
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <SupplierSpellSearch onChange={handleSupplierChange} value={filter.sName} onReset={handleReset} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <PurchaseProductSelect type="purchase" onChangeAction={handleProductChange} value={filter.pName} onReset={handleReset} />
            </Grid>
        </Grid>
    );
};

export default PurchaseFilter;