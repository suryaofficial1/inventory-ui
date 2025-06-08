import { Button, Grid, InputLabel } from '@material-ui/core';
import { format, subMonths } from 'date-fns';
import React, { useState } from 'react';
import DateRangeDropdown from '../../../../common/date-range/DateRangeDropdown';
import SupplierSpellSearch from '../../../../common/select-box/SupplierSpellSearch';
import ProductNameByType from '../../../../common/input-search/ProductNameByType';

const Filter = ({ applyFilter, reset }) => {
  const [supplier, setSupplier] = React.useState({});
  const [product, setProduct] = useState('');
  const [selectedRange, setSelectedRange] = useState({
    start: format(subMonths(new Date(), 3), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [clearSignal, setClearSignal] = useState(0);

  const handleDateChange = ({ start, end }) => {
    setSelectedRange({ start, end });
  };

  const handleProductChange = (e) => {
    setProduct(e.name);
  };

  const handleSupplierChange = (e) => {
    setSupplier(e);
  }
  const handleReset = () => {
    setSelectedRange({
      start: format(subMonths(new Date(), 3), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd')
    });
    setSupplier({});
    setProduct({});
    setClearSignal(prev => prev + 1);
    handleSupplierChange('')
    reset()
  }

  const search = () => {
    applyFilter(selectedRange, supplier, product)
  }

  return (
    <Grid container spacing={2} alignContent='center' alignItems='center'>
      <Grid item xs={12} sm={3}>
        <DateRangeDropdown onDateChange={handleDateChange} clearSignal={clearSignal} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
        <SupplierSpellSearch onChange={handleSupplierChange} value={supplier} onReset={handleReset} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <InputLabel id="demo-simple-select-label">Product</InputLabel>
        <ProductNameByType
          type="purchase_return"
          onSelect={handleProductChange}
          clearSignal={clearSignal} />
      </Grid>
      <Grid item xs={12} sm={12} md={3} align="center">
        <Button
          style={{
            marginTop: 20, backgroundColor: '#a76060',
            color: 'white', marginRight: 8
          }}
          variant="contained" onClick={search}>
          Generate Report
        </Button>
        <Button
          style={{ marginTop: 20 }}
          color='secondary'
          variant="contained" onClick={handleReset}>
          Reset
        </Button>
      </Grid>
    </Grid>
  )
}

export default Filter
