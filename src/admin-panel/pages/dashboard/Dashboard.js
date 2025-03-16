import { Grid, Typography } from '@material-ui/core';
import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { CardGiftcard, List, Money, People, Person, Store } from '@material-ui/icons';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { logoutUser } from '../../../actions';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("weekly");

  const user = useSelector((state) => state.user);
  const logout = () => {
    dispatch(logoutUser());
    window.location.href = '/login';
  }
  const data = {
    weekly: [
      { name: "Mon", Purchase: 5000, Sales: 3000 },
      { name: "Tue", Purchase: 7000, Sales: 4000 },
      { name: "Wed", Purchase: 6000, Sales: 5000 },
      { name: "Thu", Purchase: 8000, Sales: 6000 },
      { name: "Fri", Purchase: 9000, Sales: 7000 },
      { name: "Sat", Purchase: 10000, Sales: 8000 },
      { name: "Sun", Purchase: 7000, Sales: 6000 },
    ],
    monthly: [
      { name: "Jan", Purchase: 40000, Sales: 30000 },
      { name: "Feb", Purchase: 50000, Sales: 40000 },
      { name: "Mar", Purchase: 45000, Sales: 35000 },
      { name: "Apr", Purchase: 48000, Sales: 36000 },
      { name: "May", Purchase: 50000, Sales: 40000 },
      { name: "Jun", Purchase: 60000, Sales: 50000 },
    ],
    yearly: [
      { name: "2020", Purchase: 300000, Sales: 200000 },
      { name: "2021", Purchase: 350000, Sales: 250000 },
      { name: "2022", Purchase: 400000, Sales: 300000 },
      { name: "2023", Purchase: 450000, Sales: 350000 },
    ],
  };

  const orderData = {
    weekly: [
      { name: "Mon", Ordered: 1000, Delivered: 800 },
      { name: "Tue", Ordered: 1200, Delivered: 1000 },
      { name: "Wed", Ordered: 900, Delivered: 700 },
      { name: "Thu", Ordered: 1500, Delivered: 1300 },
      { name: "Fri", Ordered: 1100, Delivered: 900 },
      { name: "Sat", Ordered: 1800, Delivered: 1500 },
      { name: "Sun", Ordered: 1300, Delivered: 1100 },
    ],
    monthly: [
      { name: "Jan", Ordered: 3000, Delivered: 2500 },
      { name: "Feb", Ordered: 4000, Delivered: 3500 },
      { name: "Mar", Ordered: 3500, Delivered: 3000 },
      { name: "Apr", Ordered: 4500, Delivered: 4000 },
      { name: "May", Ordered: 5000, Delivered: 4500 },
    ],
    yearly: [
      { name: "2020", Ordered: 30000, Delivered: 25000 },
      { name: "2021", Ordered: 40000, Delivered: 38000 },
      { name: "2022", Ordered: 45000, Delivered: 42000 },
      { name: "2023", Ordered: 50000, Delivered: 47000 },
    ],
  };

  const columnMapping = {
    "Name": "name",
    "Sold quantity": "Sold quantity",
    "Remaining quantity": "Remaining quantity",
    "Pricee": "Price",
  };

  const productData = [
    { name: 'Surf Excel', "Sold quantity": 30, "Remaining quantity": 12, "Price": 100 },
    { name: 'Colgate', "Sold quantity": 12, "Remaining quantity": 5, "Price": 50 },
    { name: 'Dove', "Sold quantity": 10, "Remaining quantity": 3, "Price": 30 },
    { name: 'Pepsodent', "Sold quantity": 8, "Remaining quantity": 2, "Price": 20 },
    { name: 'Colgate', "Sold quantity": 12, "Remaining quantity": 5, "Price": 50 },
    { name: 'Dove', "Sold quantity": 10, "Remaining quantity": 3, "Price": 30 },
    { name: 'Pepsodent', "Sold quantity": 8, "Remaining quantity": 2, "Price": 20 },
  ];

  const overviewData = [
    { title: "Customer", value: "50", icon: <People /> },
    { title: "Product", value: "50", icon: <Store /> },
    { title: "Order", value: "50", icon: <CardGiftcard /> },
    { title: "Sales", value: "50", icon: <Money /> }
  ]

  const purchaseOverviewData = [
    { title: "Purchase", value: "₹832", icon: <Money /> },
    { title: "Cost", value: "₹18,300", icon: <Money /> },
    { title: "Cancel", value: "₹868", icon: <Money /> },
    { title: "Return", value: "₹17,432", icon: <Money /> },
  ]

  const inventorySummary = [
    { title: "Quantity in Hand", value: "50", icon: <AttachMoneyIcon /> },
    { title: "To be received", value: "50", icon: <TrendingUpIcon /> },
  ]

  const productSummary = [
    { title: "Suppliers", value: "50", icon: <Person /> },
    { title: "Categories", value: "50", icon: <List /> }
  ]

  return (
    <>
      <Grid container spacing={1}>
        <Grid item sm={12} align="center">
          <Typography variant='h4' color='error'>In Progress</Typography>
        </Grid>
        {/* <Grid item xs={12} sm={7}>
          <OverviewCards title="Sales Overview" data={overviewData} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <OverviewCards title="Inventory Summary" data={inventorySummary} />
        </Grid>
        <Grid item xs={12} sm={7}>
          <OverviewCards title="Purchase Overview" data={purchaseOverviewData} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <OverviewCards title="Product Summary" data={productSummary} />
        </Grid>
        <Grid item xs={12} sm={7}>
          <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0 }}>Sales & Purchase</h3>
              <ButtonGroup variant="outlined" size="small">
                <Button onClick={() => setFilter("weekly")} variant={filter === "weekly" ? "contained" : "outlined"}>
                  Weekly
                </Button>
                <Button onClick={() => setFilter("monthly")} variant={filter === "monthly" ? "contained" : "outlined"}>
                  Monthly
                </Button>
                <Button onClick={() => setFilter("yearly")} variant={filter === "yearly" ? "contained" : "outlined"}>
                  Yearly
                </Button>
              </ButtonGroup>
            </div>
            <BarChart width={500} height={300} data={data[filter]}>
              <CartesianGrid strokeDasharray="3 3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Purchase" fill="#8884d8" />
              <Bar dataKey="Sales" fill="#82ca9d" />
            </BarChart>
          </div>
        </Grid>
        <Grid item xs={12} sm={5}>
          <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0 }}>Order Summary</h3>
              <ButtonGroup variant="outlined" size="small">
                <Button onClick={() => setFilter("weekly")} variant={filter === "weekly" ? "contained" : "outlined"}>
                  Weekly
                </Button>
                <Button onClick={() => setFilter("monthly")} variant={filter === "monthly" ? "contained" : "outlined"}>
                  Monthly
                </Button>
                <Button onClick={() => setFilter("yearly")} variant={filter === "yearly" ? "contained" : "outlined"}>
                  Yearly
                </Button>
              </ButtonGroup>
            </div>
            <LineChart width={350} height={300} data={orderData[filter]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Ordered" stroke="#f6a623" strokeWidth={2} />
              <Line type="monotone" dataKey="Delivered" stroke="#6c63ff" strokeWidth={2} />
            </LineChart>
          </div>
        </Grid>
        <Grid sm={12}>
          <ReportTables title="Top Selling Stock" 
          headers={["name", "Sold quantity", "Remaining quantity", "Price"]} 
          rows={productData}
          showAll="See All"
          showAllLink="#sales"
          columnMapping={columnMapping}
          
          />
          
        </Grid> */}
      </Grid>
    </>
  )
}

export default Dashboard;
