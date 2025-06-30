import { Grid } from '@material-ui/core';
import React from 'react';
import PurchaseItemsSpellSearch from '../../../common/input-search/PurchaseItemsSpellSearch';
import SupplierSpellSearch from '../../../common/select-box/SupplierSpellSearch';

const PurchaseFilter = ({ filter, setFilter, reset , clearSignal}) => {

    const handleSupplierChange = (e) => {
        setFilter({ ...filter, "sName": e });
    };
    const handleProductChange = (e) => {
        setFilter({ ...filter, "pName": e.product });
    };

    const handleReset = () => {
        setFilter({ pName: {}, sName: '' });
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
                
                <PurchaseItemsSpellSearch
                    type="purchase_return"
                    qtyShow={true}
                    onSelect={(e) => handleProductChange(e)}
                    clearSignal={clearSignal}
                />
            </Grid>
        </Grid>
    );
};

export default PurchaseFilter;