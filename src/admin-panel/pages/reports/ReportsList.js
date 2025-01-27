import { Paper, Tab, Tabs } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CUSTOMERS_LIST, PRODUCTS_LIST, SUPPLIERS_LIST } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { sendGetRequest } from '../../../utils/network';
import FIFOReport from './FIFOReport';
import PurchaseReport from './PurchaseReport';
import ReportFilter from './ReportFilter';
import SalesAndPurchase from './SalesAndPurchase';
import SalesReport from './SalesReport';
import StockReport from './StockReport';

const ReportsHome = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [{ start, stop }, Loader, loading] = useLoader();
    const user = useSelector((state) => state.user);
    const [formsData, setFormData] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
        getCustomers();
        getProducts();
        getSuppliers();
    }, [])

    const getCustomers = () => {
        start()
        sendGetRequest(CUSTOMERS_LIST, "token")
            .then(res => {
                if (res.status === 200) {
                    setCustomers(res.data);
                } else {
                    console.log("Error in get customers", res.data)
                }
            }).catch(err => {
                console.log(err)
            }).finally(stop)
    }
    const getProducts = () => {
        start()
        sendGetRequest(PRODUCTS_LIST, "token")
            .then(res => {
                if (res.status === 200) {
                    setProducts(res.data);
                } else {
                    console.log("Error in get products", res.data)
                }
            }).catch(err => {
                console.log(err)
            }).finally(stop)
    }
    const getSuppliers = () => {
        start()
        sendGetRequest(SUPPLIERS_LIST, "token")
            .then(res => {
                if (res.status === 200) {
                    setSuppliers(res.data);
                } else {
                    console.log("Error in get suppliers", res.data)
                }
            }).catch(err => {
                console.log(err)
            }).finally(stop)
    }


    return (
        <>
            <Paper className='tab-container'>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Sales Report" className='tab-menus' />
                    <Tab label="Purchase Report" className='tab-menus' />
                    <Tab label="Stock Report" className='tab-menus' />
                    <Tab label="Sales & purchase charts" className='tab-menus' />
                    <Tab label="FIFO Report" className='tab-menus' />
                </Tabs>
            </Paper>
            <ReportFilter formsData={formsData}
             handleInputChange={handleInputChange} selectedTab={selectedTab} customers={customers} products={products} suppliers={suppliers} />
            {selectedTab === 0 && <SalesReport />}
            {selectedTab === 1 && <PurchaseReport />}
            {selectedTab === 2 && <StockReport />}
            {selectedTab === 3 && <SalesAndPurchase />}
            {selectedTab === 4 && <FIFOReport />}
        </>
    );
};

export default ReportsHome;