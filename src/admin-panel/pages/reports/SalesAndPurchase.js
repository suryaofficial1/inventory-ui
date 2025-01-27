import React from 'react'
import OverviewCards from '../../../common/report-components/OverviewCards'
import { CardGiftcard, Money, People, Store } from '@material-ui/icons'
import { Grid } from '@material-ui/core'
import MultiBarChart from '../../../common/report-components/MultiBarChart'
import PeiChart from '../../../common/report-components/PeiChart'
import ProgressBarChart from '../../../common/report-components/ProgressBarChart'
import ReportTables from '../../../common/report-components/ReportTables'

const SalesAndPurchase = () => {

    const SalesOverviewData = [
        { title: "Customer", value: "50", icon: <People /> },
        { title: "Order", value: "80", icon: <Store /> },
        { title: "Sales", value: "₹450000", icon: <Money /> },
        { title: "Average Order", value: "₹450000", icon: <CardGiftcard /> },
    ]
    const purchaseOverviewData = [
        { title: "Supplier", value: "50", icon: <People /> },
        { title: "Order", value: "80", icon: <Store /> },
        { title: "Purchase", value: "₹450000", icon: <Money /> },
        { title: "Average Order", value: "₹450000", icon: <CardGiftcard /> },
    ]

    const data = {
        daily: [
            { date: "2024-11-12", Sales: 3000, Purchase: 4000 },
            { date: "2024-11-13", Sales: 4000, Purchase: 5000 },
            { date: "2024-11-14", Sales: 5000, Purchase: 6000 },
            { date: "2024-11-15", Sales: 6000, Purchase: 7000 },
            { date: "2024-11-16", Sales: 7000, Purchase: 8000 },
            { date: "2024-11-17", Sales: 8000, Purchase: 9000 },
            { date: "2024-11-18", Sales: 9000, Purchase: 10000 },
            { date: "2024-11-19", Sales: 1000, Purchase: 11000 },
            { date: "2024-11-20", Sales: 11000, Purchase: 12000 },
            { date: "2024-11-21", Sales: 12000, Purchase: 13000 },
            { date: "2024-11-22", Sales: 13000, Purchase: 14000 },
            { date: "2024-11-23", Sales: 14000, Purchase: 15000 },
            { date: "2024-11-24", Sales: 15000, Purchase: 16000 },
            { date: "2024-11-25", Sales: 1600, Purchase: 17000 },
            { date: "2024-11-26", Sales: 17000, Purchase: 18000 },
            { date: "2024-11-27", Sales: 1000, Purchase: 11000 },
            { date: "2024-11-28", Sales: 1000, Purchase: 12000 },
            { date: "2024-11-29", Sales: 8000, Purchase: 13000 },
            { date: "2024-11-30", Sales: 21000, Purchase: 22000 },
            { date: "2024-12-01", Sales: 22000, Purchase: 23000 },
            { date: "2024-12-02", Sales: 23000, Purchase: 24000 },
            { date: "2024-12-03", Sales: 24000, Purchase: 25000 },
            { date: "2024-12-04", Sales: 25000, Purchase: 26000 },
            { date: "2024-12-05", Sales: 26000, Purchase: 27000 },
            { date: "2024-12-06", Sales: 27000, Purchase: 28000 },
            { date: "2024-12-07", Sales: 28000, Purchase: 29000 },
            { date: "2024-12-08", Sales: 29000, Purchase: 30000 },
            { date: "2024-12-09", Sales: 30000, Purchase: 31000 },
            { date: "2024-12-10", Sales: 31000, Purchase: 32000 },
            { date: "2024-12-11", Sales: 32000, Purchase: 33000 },
            { date: "2024-12-12", Sales: 33000, Purchase: 34000 },
        ],
    };

    const fromDate = "2024-11-12";
    const toDate = "2025-04-10";

    const filterDataByDate = (data, fromDate, toDate) => {
        const from = new Date(fromDate);
        const to = new Date(toDate);

        return data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= from && itemDate <= to;
        });
    };

    const filteredData = filterDataByDate(data.daily, fromDate, toDate);

    const SalesPeiData = [
        ['name', 'value'],
        ['kg', 10],
        ['Bag', 2],
        ['Mtr', 2],
        ['noc', 8],
    ];
    const SalesProductData = [
        { pName: "Bags", quantity: 10 },
        { pName: "Pipe", quantity: 8 },
        { pName: "cable", quantity: 16 },
        { pName: "cable", quantity: 16 },
        { pName: "Plastic", quantity: 20 },
        { pName: "Plastic", quantity: 20 },
    ]

    const PurchasePeiData = [
        ['name', 'value'],
        ['kg', 10],
        ['Bag', 2],
        ['Mtr', 2],
        ['noc', 8],
    ];
    const PurchaseProductData = [
        { pName: "Bags", quantity: 10 },
        { pName: "Pipe", quantity: 8 },
        { pName: "cable", quantity: 16 },
        { pName: "cable", quantity: 16 },
        { pName: "Plastic", quantity: 20 },
        { pName: "Plastic", quantity: 20 },
    ]

    const SalesRows = [
        {
            id: 1,
            "Customer Name": "John Doe",
            Quantity: 15,
            "Sales Price": 1200,
            "Sales Date": "2025-01-01",
            Unit: "Bags",
            Status: "Completed",
        },
        {
            id: 2,
            "Customer Name": "Jane Smith",
            "Product Desc": "Stainless Steel Pipe",
            Quantity: 25,
            "Sales Price": 750,
            "Sales Date": "2025-01-02",
            Unit: "Mtr",
            Status: "Pending",
        },
        {
            id: 3,
            "Customer Name": "Michael Johnson",
            "Product Desc": "Copper Cable",
            Quantity: 40,
            "Sales Price": 350,
            "Sales Date": "2025-01-03",
            Unit: "Kg",
            Status: "Completed",
        },
        {
            id: 4,
            "Customer Name": "Emily Davis",
            "Product Desc": "Plastic Sheets",
            Quantity: 100,
            "Sales Price": 500,
            "Sales Date": "2025-01-04",
            Unit: "Nos",
            Status: "Completed",
        },
        {
            id: 5,
            "Customer Name": "Chris Brown",
            "Product Desc": "PVC Pipe",
            Quantity: 30,
            "Sales Price": 600,
            "Sales Date": "2025-01-05",
            Unit: "Mtr",
            Status: "In Progress",
        },
        {
            id: 6,
            "Customer Name": "Sophia Taylor",
            "Product Desc": "Aluminum Foil",
            Quantity: 20,
            "Sales Price": 800,
            "Sales Date": "2025-01-06",
            Unit: "Kg",
            Status: "Completed",
        },
        {
            id: 7,
            "Customer Name": "James Anderson",
            "Product Desc": "Ceramic Tiles",
            Quantity: 60,
            "Sales Price": 900,
            "Sales Date": "2025-01-07",
            Unit: "Nos",
            Status: "Pending",
        },
        {
            id: 8,
            "Customer Name": "Olivia Martinez",
            "Product Desc": "Wooden Panels",
            Quantity: 35,
            "Sales Price": 1100,
            "Sales Date": "2025-01-08",
            Unit: "Bags",
            Status: "Completed",
        },
        {
            id: 9,
            "Customer Name": "William Lee",
            "Product Desc": "Glass Bottles",
            Quantity: 50,
            "Sales Price": 700,
            "Sales Date": "2025-01-09",
            Unit: "Nos",
            Status: "Completed",
        },
        {
            id: 10,
            "Customer Name": "Isabella Wilson",
            "Product Desc": "Rubber Mats",
            Quantity: 45,
            "Sales Price": 450,
            "Sales Date": "2025-01-10",
            Unit: "Kg",
            Status: "In Progress",
        },
        {
            id: 11,
            "Customer Name": "Liam White",
            "Product Desc": "Concrete Blocks",
            Quantity: 70,
            "Sales Price": 1300,
            "Sales Date": "2025-01-11",
            Unit: "Nos",
            Status: "Completed",
        },
        {
            id: 12,
            "Customer Name": "Emma Thomas",
            "Product Desc": "Paint Cans",
            Quantity: 25,
            "Sales Price": 950,
            "Sales Date": "2025-01-12",
            Unit: "Bags",
            Status: "Completed",
        },
    ];

    const PurchaseRows = [
        {
            id: 1,
            "Supplier Name": "John Doe",
            Quantity: 15,
            "Price": 1200,
            "Date": "2025-01-01",
            Unit: "Bags",
            Status: "Completed",
        },
        {
            id: 2,
            "Supplier Name": "Jane Smith",
            "Product Desc": "Stainless Steel Pipe",
            Quantity: 25,
            "Price": 750,
            "Date": "2025-01-02",
            Unit: "Mtr",
            Status: "Pending",
        },
        {
            id: 3,
            "Supplier Name": "Michael Johnson",
            "Product Desc": "Copper Cable",
            Quantity: 40,
            "Price": 350,
            "Date": "2025-01-03",
            Unit: "Kg",
            Status: "Completed",
        },
        {
            id: 4,
            "Supplier Name": "Emily Davis",
            "Product Desc": "Plastic Sheets",
            Quantity: 100,
            "Price": 500,
            "Date": "2025-01-04",
            Unit: "Nos",
            Status: "Completed",
        },
        {
            id: 5,
            "Supplier Name": "Chris Brown",
            "Product Desc": "PVC Pipe",
            Quantity: 30,
            "Price": 600,
            "Date": "2025-01-05",
            Unit: "Mtr",
            Status: "In Progress",
        },
        {
            id: 6,
            "Supplier Name": "Sophia Taylor",
            "Product Desc": "Aluminum Foil",
            Quantity: 20,
            "Price": 800,
            "Date": "2025-01-06",
            Unit: "Kg",
            Status: "Completed",
        },
        {
            id: 7,
            "Supplier Name": "James Anderson",
            "Product Desc": "Ceramic Tiles",
            Quantity: 60,
            "Price": 900,
            "Date": "2025-01-07",
            Unit: "Nos",
            Status: "Pending",
        },
        {
            id: 8,
            "Supplier Name": "Olivia Martinez",
            "Product Desc": "Wooden Panels",
            Quantity: 35,
            "Price": 1100,
            "Date": "2025-01-08",
            Unit: "Bags",
            Status: "Completed",
        },
        {
            id: 9,
            "Supplier Name": "William Lee",
            "Product Desc": "Glass Bottles",
            Quantity: 50,
            "Price": 700,
            "Date": "2025-01-09",
            Unit: "Nos",
            Status: "Completed",
        },
        {
            id: 10,
            "Supplier Name": "Isabella Wilson",
            "Product Desc": "Rubber Mats",
            Quantity: 45,
            "Price": 450,
            "Date": "2025-01-10",
            Unit: "Kg",
            Status: "In Progress",
        },
        {
            id: 11,
            "Supplier Name": "Liam White",
            "Product Desc": "Concrete Blocks",
            Quantity: 70,
            "Price": 1300,
            "Date": "2025-01-11",
            Unit: "Nos",
            Status: "Completed",
        },
        {
            id: 12,
            "Supplier Name": "Emma Thomas",
            "Product Desc": "Paint Cans",
            Quantity: 25,
            "Price": 950,
            "Date": "2025-01-12",
            Unit: "Bags",
            Status: "Completed",
        },
    ];
    return (
        <>
            <Grid container spacing={1}>
                <Grid item sm={12}>
                    <OverviewCards title="Sales Overview" data={SalesOverviewData} />
                </Grid>
                <Grid item sm={12}>
                    <OverviewCards title="Purchase Overview" data={purchaseOverviewData} />
                </Grid>
                <Grid item sm={12}>
                    <MultiBarChart title="Sales & Purchase" data={filteredData} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <PeiChart title="Product Sales by Unit" PeiData={SalesPeiData} />
                </Grid>
                <Grid item xs={12} sm={6} >
                    <ProgressBarChart title="Product Sales by quantity" productData={SalesProductData} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <PeiChart title="Product Purchase by Unit" PeiData={PurchasePeiData} />
                </Grid>
                <Grid item xs={12} sm={6} >
                    <ProgressBarChart title="Product Purchase by quantity" productData={PurchaseProductData} />
                </Grid>
                <Grid item xs={12}>
                    <ReportTables title="Top Selling Stock"
                        headers={["id", "Customer Name", "Quantity", "Sales Price", "Sales Date", "Unit", "Status"]}
                        rows={SalesRows}
                        showAll="See All"
                        showAllLink="#sales"
                    />
                </Grid>
                <Grid item xs={12}>
                    <ReportTables title="Top Purchased Stock"
                        headers={["id", "Supplier Name", "Quantity", "Price", "Date", "Unit", "Status"]}
                        rows={PurchaseRows}
                        showAll="See All"
                        showAllLink="#purchase"
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default SalesAndPurchase