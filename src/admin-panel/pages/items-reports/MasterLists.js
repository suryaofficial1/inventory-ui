import { Paper, Tab, Tabs } from '@mui/material';
import React from 'react';
import SalesList from './sales-reports/List';
import SalesReturnList from './sales-return-report/List';
import PurchaseReportList from './purchase-report/List';
import PurchaseReturnReportList from './purchase-return-report/List';
import StockReport from './stock-report/List';
import FifoReport from './fifo-report/FifoReport';

const MasterLists = () => {
    const [selectedTab, setSelectedTab] = React.useState(2);
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const renderReportComponent = () => {
        const reportComponents = [
            <PurchaseReportList />,
            <PurchaseReturnReportList />,
            <StockReport />,
            <FifoReport />,
            <SalesList />,
            <SalesReturnList />,
        ];
        return reportComponents[selectedTab];
    };
    return (
        <div>
            <Paper className='tab-container'>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Purchase Report" />
                    <Tab label="Purchase Return" />
                    <Tab label="Stock Report" />
                    <Tab label="FIFO Report" />
                    <Tab label="Sales Report" />
                    <Tab label="Sales Return" />
                </Tabs>
            </Paper>
            {renderReportComponent()}
        </div>
    )
}

export default MasterLists
