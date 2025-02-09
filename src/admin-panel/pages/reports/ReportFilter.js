import { Button, Grid, TextField } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import React, { useState } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';

const format = "YYYY-MM-DD";

const ReportFilter = ({ selectedTab, customers, products, suppliers, onFilter }) => {
    const [dates, setDates] = useState([new DateObject().set(), new DateObject().set()]);
    const [formsData, setFormData] = useState({
        cId: '',
        sId: '',
        pId: '',
        from: '',
        to: '',

    })

    const handleListChanges = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value?.id || "" }));
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
                    onChange={(e, value) => handleListChanges(selectedTab === 0 ? "cId" : "sId", value)}
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
                    onChange={(e, value) => handleListChanges("pId", value)}
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
            </Grid>
        </Grid>
    );
};

export default ReportFilter;
