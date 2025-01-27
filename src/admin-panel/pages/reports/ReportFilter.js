import { Button, Grid, InputAdornment, MenuItem, TextField } from '@material-ui/core'
import { Filter, SearchOutlined } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import React, { useState } from 'react'
import DatePicker, { DateObject } from 'react-multi-date-picker';

const format = "DD-MM-YYYY";
const ReportFilter = ({ selectedTab, customers, products, suppliers, formsData, handleInputChange }) => {

    const [dates, setDates] = useState([
        new DateObject().set(),
        new DateObject().set()
    ]);

    return (
        <Grid container spacing={1} justifyContent='center' alignItems='center' alignContent='center'>
            <Grid item xs={12} sm={3}>
                {selectedTab === 0 ?
                    <Autocomplete
                        fullWidth
                        disableClearable
                        size='small'
                        id="customer"
                        options={customers}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Customer"
                                size='small'
                                placeholder='Enter customer name ...'
                                margin="normal"
                                variant="outlined"
                                InputProps={{ ...params.InputProps, type: 'search' }}
                            />
                        )}
                    />
                    :
                    <Autocomplete
                        fullWidth
                        disableClearable
                        size='small'
                        id="Supplier"
                        options={suppliers}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Supplier"
                                size='small'
                                placeholder='Enter supplier name ...'
                                margin="normal"
                                variant="outlined"
                                InputProps={{ ...params.InputProps, type: 'search' }}
                            />
                        )}
                    />
                }
            </Grid>
            <Grid item xs={12} sm={3}>
                <Autocomplete
                    fullWidth
                    disableClearable
                    size='small'
                    id="Product"
                    options={products}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Product"
                            size='small'
                            placeholder='Enter product name ...'
                            margin="normal"
                            variant="outlined"
                            InputProps={{ ...params.InputProps, type: 'search' }}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={3} align="center">
                <DatePicker
                    style={{ height: "auto", padding: 9,  marginTop: 8, width: "100%" }}
                    className='date-picker'
                    value={dates}
                    onChange={setDates}
                    range
                    format={format}
                    calendarPosition="bottom-center"
                    InputProps={{ style: { padding: 15, marginTop: 8, width: "100%" } }}
                />
            </Grid>
            <Grid item xs={12} sm={3} align="center">
                <Button
                    className='filter-btn'
                    startIcon={<SearchOutlined />}
                    variant='outlined'
                    color='primary'
                >Filter</Button>
            </Grid>
        </Grid>
    )
}

export default ReportFilter