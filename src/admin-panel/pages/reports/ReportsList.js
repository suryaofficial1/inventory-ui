import { Box, Paper, Tab, Tabs } from '@material-ui/core';
import React, { useState } from 'react';
import Charts from './Charts';
import FIFOReport from './FIFOReport';
import PurchaseReport from './PurchaseReport';
import SalesReport from './SalesReport';
import StockReport from './StockReport';

const ReportsHome = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <>
        <Paper style={{backgroundColor: '#a7606047'}}>
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
                variant=''
            >
                <Tab label="Sales Report"   style={{color: '#a76060'}}/>
                <Tab label="Purchase Report"  color='primary'/>
                <Tab label="Stock Report" />
                <Tab label="Charts" />
                <Tab label="FIFO Report" />
            </Tabs>

        </Paper>
        <>
            {selectedTab === 1 && <PurchaseReport />}
            {selectedTab === 0 && <SalesReport />}
            {selectedTab === 2 && <StockReport />}
            {selectedTab === 3 && <Charts />}
            {selectedTab === 4 && <FIFOReport />}
        </>
        </>
    );
};

export default ReportsHome;