import { Button, Grid, TextField } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { Autocomplete } from '@material-ui/lab';
import React, { useState } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';

const format = "YYYY-MM-DD";

const ReportFilter = ({ selectedTab, customers, products, suppliers, onFilter, reset }) => {
    const [dates, setDates] = useState([new DateObject().add(-3, "days"), new DateObject().set()]);
    const [formsData, setFormData] = useState({
        customer: '',
        supplier: '',
        product: '',
        from: '',
        to: ''

    })

    const handleListChanges = (name, value) => {
        if (name) {
            setFormData((prev) => ({ ...prev, [name]: value || "" }));
        } else {
            setFormData({});
        }
    };

    const resetFilters = () => {
        setFormData({
            customer: '',
            supplier: '',
            product: '',
            from: '',
            to: ''
        });
        handleListChanges('')
        setDates([new DateObject().add(-3, "days"), new DateObject().set()]);
        reset();
    };

    return (
        <Grid container spacing={1} justifyContent='center' alignItems='center' alignContent='center'>
            <Grid item xs={12} sm={3}>
                <Autocomplete
                    fullWidth
                    disableClearable
                    size='small'
                    id="customer"
                    value={selectedTab === 0 ? formsData?.customer ? formsData?.customer : null : formsData?.supplier ? formsData?.supplier : null || null}
                    options={selectedTab === 0 ? customers : suppliers}
                    onChange={(e, value) => handleListChanges(selectedTab === 0 ? "customer" : "supplier", value)}
                    getOptionLabel={(option) => option.id + "-" + option.name}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={selectedTab === 0 ? "Select Customer" : "Select Supplier"}
                            size='small'
                            margin="normal"
                            variant="outlined"
                            InputProps={{ ...params.InputProps, type: 'search' }}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <Autocomplete
                    fullWidth
                    disableClearable
                    size='small'
                    id="Product"
                    value={formsData.product || null}
                    options={products}
                    onChange={(e, value) => handleListChanges("product", value)}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Product"
                            size='small'
                            margin="normal"
                            variant="outlined"
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={3} align="center">
                <DatePicker
                    style={{ width: "100%", padding: "9px", marginTop: "8px" }}
                    value={dates}
                    onChange={(dateRange) => {
                        const validDateRange = dateRange && dateRange.length ? dateRange : [];

                        setDates(validDateRange);

                        setFormData((prev) => ({
                            ...prev,
                            from: validDateRange[0]?.format(format) || "",
                            to: validDateRange[1]?.format(format) || ""
                        }));
                    }}
                    range
                    format={format}
                    calendarPosition="bottom-center"
                />
            </Grid>
            <Grid item xs={12} sm={3} align="center">
                <Button
                    className='filter-btn'
                    startIcon={<SearchOutlined />}
                    variant='outlined'
                    color='primary'
                    onClick={() => onFilter(formsData)}
                >
                    Filter
                </Button>
                <Button
                    className='reset-filter-btn'
                    startIcon={<RotateLeftIcon />}
                    variant='outlined'
                    color='secondary'
                    onClick={resetFilters}
                >
                    Reset
                </Button>
            </Grid>
        </Grid>
    );
};

export default ReportFilter;
