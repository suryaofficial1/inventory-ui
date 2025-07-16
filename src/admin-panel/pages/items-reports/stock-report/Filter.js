import { Button, Grid, InputLabel } from '@material-ui/core';
import { format, subMonths } from 'date-fns';
import React, { useState } from 'react';
import DateRangeDropdown from '../../../../common/date-range/DateRangeDropdown';
import ProductNameByType from '../../../../common/input-search/ProductNameByType';

const Filter = ({ applyFilter, reset, isDisabled = false }) => {
  const [type, setType] = React.useState('purchase');
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
    setType(e);
  }
  const handleReset = () => {
    setSelectedRange({
      start: format(subMonths(new Date(), 3), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd')
    });
    setType('purchase');
    setProduct('');
    setClearSignal(prev => prev + 1);
    handleSupplierChange('')
    reset()
  }

  const search = () => {
    applyFilter(selectedRange, type, product)
  }

  return (
    <Grid container spacing={2} alignContent='center' alignItems='center'>
      <Grid item xs={12} sm={3}>
        <DateRangeDropdown onDateChange={handleDateChange} clearSignal={clearSignal} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <InputLabel id="demo-simple-select-label">Item Type</InputLabel>
        <select onChange={(e) => setType(e.target.value)} style={{
          border: '1px solid #b1b0b0',
          borderRadius: 6,
          padding: '9px 20px',
          margin: '2px',
          cursor: 'pointer',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          color: "#000000b8",
          width: '100%'
        }}>
          <option value="purchase">Purchase</option>
          {!isDisabled && <option value="sales">Finished Good</option>}
        </select>

      </Grid>
      <Grid item xs={12} sm={3}>
        <InputLabel id="demo-simple-select-label">Product</InputLabel>
        {type == 'purchase' ? <ProductNameByType
          type="purchase"
          onSelect={handleProductChange}
          clearSignal={clearSignal} /> :
          <ProductNameByType
            type="sales"
            onSelect={handleProductChange}
            clearSignal={clearSignal} />
        }
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
