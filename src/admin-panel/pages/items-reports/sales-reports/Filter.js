import { Button, Grid, InputLabel } from '@material-ui/core';
import { format, subMonths } from 'date-fns';
import DateRangeDropdown from '../../../../common/date-range/DateRangeDropdown';
import SalesProductSpellSearch from '../../../../common/input-search/SalesProductSpellSearch';
import CustomerSpellSearch from '../../../../common/select-box/CustomerSpellSearch';
import React, { useState } from 'react';
import ProductNameByType from '../../../../common/input-search/ProductNameByType';


const Filter = ({ applyFilter, reset }) => {
  const [customer, setCustomer] = useState({});
  const [product, setProduct] = useState({});
  const [selectedRange, setSelectedRange] = useState({
    start: format(subMonths(new Date(), 3), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [clearSignal, setClearSignal] = useState(0);

  const handleDateChange = ({ start, end }) => {
    setSelectedRange({ start, end });
  };

  const handleProductChange = (e) => {
    setProduct(e);
  };

  const handleCustomerChange = (e) => {
    setCustomer(e);
  }
  const handleReset = () => {
    setSelectedRange({
      start: format(subMonths(new Date(), 3), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd')
    });
    setCustomer({});
    setProduct({});
    setClearSignal(prev => prev + 1);
    handleCustomerChange('')
    reset()
  }

  const search = () => {
    applyFilter(selectedRange, customer, product)
  }

  return (
    <Grid container spacing={2} alignContent='center' alignItems='center'>
      <Grid item xs={12} sm={3}>
        <DateRangeDropdown onDateChange={handleDateChange} clearSignal={clearSignal} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <InputLabel id="demo-simple-select-label">Customer</InputLabel>
        <CustomerSpellSearch
          onChange={handleCustomerChange} value={customer} onReset={handleReset} error={false} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <InputLabel id="demo-simple-select-label">Product</InputLabel>
        <ProductNameByType
          type={"sales"}
          onSelect={handleProductChange}
          clearSignal={clearSignal} />
      </Grid>
      <Grid item xs={12} sm={12} md={3} align="center"
      >
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
