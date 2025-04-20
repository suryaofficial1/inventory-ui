import { Paper, Tab, Tabs } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CUSTOMERS_LIST, PRODUCTION_PRODUCTS_LIST, PURCHASE_PRODUCTS_LIST, SUPPLIERS_LIST } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { sendGetRequest } from '../../../utils/network';
import ReportFilter from './ReportFilter';
// import StockReport from './StockReport';
import PurchaseReportList from './purchase-report/PurchaseReportList';
import PurchaseReturnReport from './purchase-report/PurchaseReturnReport';
import SalesReportList from './sales-report/SalesReportList';
import SalesReturnReport from './sales-report/SalesReturnReport';
import StockReport from './stock-report/StockReport';

const ReportsList = () => {
    const [selectedTab, setSelectedTab] = useState(2);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [{ start, stop }, Loader] = useLoader();
    const user = useSelector((state) => state.user);

    const [formsData, setFormData] = useState({
        customer: '',
        supplier: '',
        product: '',
        from: '',
        to: ''
    });

    const onFilter = (filters) => {
        console.log("Applying filters: ", filters);
        setFormData(filters);
    };

    const reset = () => {
        setFormData({
            customer: '',
            supplier: '',
            product: '',
            from: '',
            to: '',
            reset: true
        });

    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
        fetchData();
    }, [selectedTab]);

    const fetchData = async () => {
        try {
            let PRODUCT_URL = selectedTab == 0 ||  selectedTab == 3 ? PRODUCTION_PRODUCTS_LIST : PURCHASE_PRODUCTS_LIST
            start();
            const [customersRes, productsRes, suppliersRes] = await Promise.all([
                sendGetRequest(CUSTOMERS_LIST, user.token),
                sendGetRequest(PRODUCT_URL, user.token),
                sendGetRequest(SUPPLIERS_LIST, user.token)
            ]);
            if (customersRes.status === 200) setCustomers(customersRes.data);
            if (productsRes.status === 200) setProducts(productsRes.data);
            if (suppliersRes.status === 200) setSuppliers(suppliersRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            stop();
        }
    };


    const renderReportComponent = () => {
        const reportComponents = [
            <SalesReportList formsData={formsData} />,
            <PurchaseReportList formsData={formsData} />,
            <StockReport formsData={formsData} />,
            <SalesReturnReport formsData={formsData} />,
            <PurchaseReturnReport formsData={formsData} />,
        ];
        return reportComponents[selectedTab];
    };

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
                    <Tab label="Sales Report" />
                    <Tab label="Purchase Report" />
                    <Tab label="Stock Report" />
                    <Tab label="Sales Return" />
                    <Tab label="Purchase Return" />
                </Tabs>
            </Paper>
            <ReportFilter
                formsData={formsData}
                setFormData={setFormData}
                selectedTab={selectedTab}
                customers={customers}
                products={products}
                suppliers={suppliers}
                onFilter={onFilter}
                reset={reset}
            />
            {renderReportComponent()}
        </>
    );
};

export default ReportsList;
