import { Grid } from '@material-ui/core';
import React from "react";
import { CardGiftcard, Money, People, Store } from '@material-ui/icons';
import OverviewCards from '../../../common/report-components/OverviewCards';
import PeiChart from '../../../common/report-components/PeiChart';
import ProgressBarChart from '../../../common/report-components/ProgressBarChart';
import ReportTables from '../../../common/report-components/ReportTables';
import SingleBarChart from '../../../common/report-components/SingleBarChart';


const PurchaseReport = () => {
  const data = {
    daily: [
      { date: "2024-11-12", Sales: 3000 },
      { date: "2024-11-13", Sales: 4000 },
      { date: "2024-11-14", Sales: 5000 },
      { date: "2024-11-15", Sales: 6000 },
      { date: "2024-11-16", Sales: 7000 },
      { date: "2024-11-17", Sales: 8000 },
      { date: "2024-11-18", Sales: 9000 },
      { date: "2024-11-19", Sales: 1000 },
      { date: "2024-11-20", Sales: 11000 },
      { date: "2024-11-21", Sales: 12000 },
      { date: "2024-11-22", Sales: 13000 },
      { date: "2024-11-23", Sales: 14000 },
      { date: "2024-11-24", Sales: 15000 },
      { date: "2024-11-25", Sales: 1600 },
      { date: "2024-11-26", Sales: 17000 },
      { date: "2024-11-27", Sales: 1000 },
      { date: "2024-11-28", Sales: 1000 },
      { date: "2024-11-29", Sales: 8000 },
      { date: "2024-11-30", Sales: 21000 },
      { date: "2024-12-01", Sales: 22000 },
      { date: "2024-12-02", Sales: 23000 },
      { date: "2024-12-03", Sales: 24000 },
      { date: "2024-12-04", Sales: 25000 },
      { date: "2024-12-05", Sales: 26000 },
      { date: "2024-12-06", Sales: 27000 },
      { date: "2024-12-07", Sales: 28000 },
      { date: "2024-12-08", Sales: 29000 },
      { date: "2024-12-09", Sales: 30000 },
      { date: "2024-12-10", Sales: 31000 },
      { date: "2024-12-11", Sales: 32000 },
      { date: "2024-12-12", Sales: 33000 },
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

  const PeiData = [
    ['name', 'value'],
    ['kg', 10],
    ['Bag', 2],
    ['Mtr', 2],
    ['noc', 8],
  ];
  const productData = [
    { pName: "Bags", quantity: 10 },
    { pName: "Pipe", quantity: 8 },
    { pName: "cable", quantity: 16 },
    { pName: "cable", quantity: 16 },
    { pName: "Plastic", quantity: 20 },
    { pName: "Plastic", quantity: 20 },
  ]




  const rows = [
    {
      id: 1,
      "Supplier Name": "John Doe",
      Quantity: 15,
      "Sales Price": 1200,
      "Sales Date": "2025-01-01",
      Unit: "Bags",
      Status: "Completed",
    },
    {
      id: 2,
      "Supplier Name": "Jane Smith",
      "Product Desc": "Stainless Steel Pipe",
      Quantity: 25,
      "Sales Price": 750,
      "Sales Date": "2025-01-02",
      Unit: "Mtr",
      Status: "Pending",
    },
    {
      id: 3,
      "Supplier Name": "Michael Johnson",
      "Product Desc": "Copper Cable",
      Quantity: 40,
      "Sales Price": 350,
      "Sales Date": "2025-01-03",
      Unit: "Kg",
      Status: "Completed",
    },
    {
      id: 4,
      "Supplier Name": "Emily Davis",
      "Product Desc": "Plastic Sheets",
      Quantity: 100,
      "Sales Price": 500,
      "Sales Date": "2025-01-04",
      Unit: "Nos",
      Status: "Completed",
    },
    {
      id: 5,
      "Supplier Name": "Chris Brown",
      "Product Desc": "PVC Pipe",
      Quantity: 30,
      "Sales Price": 600,
      "Sales Date": "2025-01-05",
      Unit: "Mtr",
      Status: "In Progress",
    },
    {
      id: 6,
      "Supplier Name": "Sophia Taylor",
      "Product Desc": "Aluminum Foil",
      Quantity: 20,
      "Sales Price": 800,
      "Sales Date": "2025-01-06",
      Unit: "Kg",
      Status: "Completed",
    },
    {
      id: 7,
      "Supplier Name": "James Anderson",
      "Product Desc": "Ceramic Tiles",
      Quantity: 60,
      "Sales Price": 900,
      "Sales Date": "2025-01-07",
      Unit: "Nos",
      Status: "Pending",
    },
    {
      id: 8,
      "Supplier Name": "Olivia Martinez",
      "Product Desc": "Wooden Panels",
      Quantity: 35,
      "Sales Price": 1100,
      "Sales Date": "2025-01-08",
      Unit: "Bags",
      Status: "Completed",
    },
    {
      id: 9,
      "Supplier Name": "William Lee",
      "Product Desc": "Glass Bottles",
      Quantity: 50,
      "Sales Price": 700,
      "Sales Date": "2025-01-09",
      Unit: "Nos",
      Status: "Completed",
    },
    {
      id: 10,
      "Supplier Name": "Isabella Wilson",
      "Product Desc": "Rubber Mats",
      Quantity: 45,
      "Sales Price": 450,
      "Sales Date": "2025-01-10",
      Unit: "Kg",
      Status: "In Progress",
    },
    {
      id: 11,
      "Supplier Name": "Liam White",
      "Product Desc": "Concrete Blocks",
      Quantity: 70,
      "Sales Price": 1300,
      "Sales Date": "2025-01-11",
      Unit: "Nos",
      Status: "Completed",
    },
    {
      id: 12,
      "Supplier Name": "Emma Thomas",
      "Product Desc": "Paint Cans",
      Quantity: 25,
      "Sales Price": 950,
      "Sales Date": "2025-01-12",
      Unit: "Bags",
      Status: "Completed",
    },
  ];

  const overviewData = [
    { title: "Supplier", value: "50", icon: <People /> },
    { title: "Order", value: "80", icon: <Store /> },
    { title: "Purchase", value: "₹450000", icon: <Money /> },
    { title: "Average Order", value: "₹450000", icon: <CardGiftcard /> },
  ]


  return (
    <Grid container spacing={1}>
      <Grid item sm={12}>
        <OverviewCards title="Purchase Overview" data={overviewData} />
      </Grid>
      <Grid item sm={12}>
        <SingleBarChart title="Purchase Report" filteredData={filteredData} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <PeiChart title="Product Purchase by Unit" PeiData={PeiData} />
      </Grid>
      <Grid item xs={12} sm={6} >
        <ProgressBarChart title="Product Purchase by quantity" productData={productData} />
      </Grid>
      <Grid item xs={12}>
        <ReportTables title="Top Purchased Stock"
          headers={["id", "Supplier Name", "Quantity", "Purchase Price", "Purchase Date", "Unit", "Status"]}
          rows={rows}
          showAll="See All"
          showAllLink="#purchase"
        />
      </Grid>
    </Grid>
  )
}

export default PurchaseReport