import React, { useState, useRef } from 'react';
import { DateRangePicker } from 'react-date-range';
import { format, subMonths } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import useOutsideClick from './useOutsideClick';
import { InputLabel } from '@material-ui/core';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useEffect } from 'react';

const useStyles = makeStyles(() => ({
    wrapper: {
        position: 'relative',
        display: 'inline-block',
    },
    displayBox: {
        border: '1px solid #ddd',
        borderRadius: 6,
        padding: '6px 8px',
        cursor: 'pointer',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
        color: "#0000008a"
    },
    popup: {
        position: 'absolute',
        zIndex: 1000,
        top: 45,
        backgroundColor: 'white',
        boxShadow: '0px 3px 12px rgba(0, 0, 0, 0.2)',
        borderRadius: 10,
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '8px 16px',
        gap: 8,
    },
    cancelBtn: {
        padding: '6px 12px',
        border: 'none',
        borderRadius: 4,
        fontWeight: 'bold',
        cursor: 'pointer',
        backgroundColor: '#eee',
    },
    applyBtn: {
        padding: '6px 12px',
        border: 'none',
        borderRadius: 4,
        fontWeight: 'bold',
        cursor: 'pointer',
        backgroundColor: '#a76060',
        color: 'white',
    },
}));

const DateRangeDropdown = ({ onDateChange, clearSignal }) => {
    const classes = useStyles();
    const [showPicker, setShowPicker] = useState(false);
    const defaultRange = [
        {
            startDate: subMonths(new Date(), 3),
            endDate: new Date(),
            key: 'selection',
        },
    ];
    const [range, setRange] = useState(defaultRange);
    const wrapperRef = useRef();

    useOutsideClick(wrapperRef, () => setShowPicker(false));

    useEffect(() => {
        setRange(defaultRange);
    }, [clearSignal]);

    const handleApply = () => {
        setShowPicker(false);
        const start = format(range[0].startDate, 'yyyy-MM-dd');
        const end = format(range[0].endDate, 'yyyy-MM-dd');
        onDateChange({ start, end });
    };

    const handleCancel = () => {
        setShowPicker(false);
    };

    return (
        <div className={classes.wrapper} ref={wrapperRef}>
            <div>
                <InputLabel id="demo-simple-select-label">Choose Date</InputLabel>
            </div>
            <div className={classes.displayBox} onClick={() => setShowPicker(!showPicker)}>
                📅 {format(range[0].startDate, 'yyyy-MM-dd')} - {format(range[0].endDate, 'yyyy-MM-dd')}
            </div>

            {showPicker && (
                <div className={classes.popup}>
                    <DateRangePicker
                        onChange={(item) => setRange([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={range}
                    />
                    <div className={classes.actions}>
                        <button className={classes.cancelBtn} onClick={handleCancel}>Cancel</button>
                        <button className={classes.applyBtn} onClick={handleApply}>Apply</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangeDropdown;
