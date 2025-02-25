import { Button, FormControl, Grid, InputLabel, TextField, Typography } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import React, { useState } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

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
        console.log("name", name, value)
        setFormData((prev) => ({ ...prev, [name]: value || "" }));
    };

    const resetFilters = () => {
        setFormData({
            customer: '',
            supplier: '',
            product: '',
            from: '',
            to: ''
        });
        setDates([new DateObject().add(-3, "days"), new DateObject().set()]); // Reset DatePicker
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


                <FormControl fullWidth>
                    <InputLabel shrink>Date Range</InputLabel>
                    <DatePicker
                        style={{ width: "100%", padding: "9px", marginTop: "8px" }}
                        value={dates}
                        onChange={(dateRange) => {
                            setDates(dateRange);
                            setFormData((prev) => ({
                                ...prev,
                                from: dateRange[0]?.format(format) || "",
                                to: dateRange[1]?.format(format) || ""
                            }));
                        }}
                        range
                        format={format}
                        calendarPosition="bottom-center"
                    />
                </FormControl>

                {/* <DatePicker
                    style={{ width: "100%", padding: "9px", marginTop: "8px" }}
                    value={dates}
                    onChange={(dateRange) => {
                        setDates(dateRange); // Update local state for DatePicker UI
                        setFormData((prev) => ({
                            ...prev,
                            from: dateRange[0]?.format(format) || "",
                            to: dateRange[1]?.format(format) || ""
                        }));
                    }}
                    range
                    format={format}
                    calendarPosition="bottom-center"
                /> */}
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
