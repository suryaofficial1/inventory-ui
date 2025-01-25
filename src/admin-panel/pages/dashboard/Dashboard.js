import { Button, ButtonGroup, Card, Grid } from '@material-ui/core';
import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { List, Person } from '@material-ui/icons';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import TimelineIcon from '@material-ui/icons/Timeline';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
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

  const productData = [
    { name: 'Surf Excel', soldQuantity: 30, remainingQuantity: 12, price: 100 },
    { name: 'Rin', soldQuantity: 21, remainingQuantity: 15, price: 207 },
    { name: 'Parle G', soldQuantity: 19, remainingQuantity: 17, price: 105 },
  ];

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={7}>
          <Card>
            <div className="card-container">
              <p className="card-title">Sales Overview</p>
              <div className="details">
                <div className="detail-item">
                  <AttachMoneyIcon className="icon" />
                  <div className="details-data">
                    <p className="value">₹832</p>
                    <p className="label">Sales</p>
                  </div>
                </div>
                <div className="detail-item">
                  <TrendingUpIcon className="icon" />
                  <div className="details-data">
                    <p className="value">₹18,300</p>
                    <p className="label">Revenue</p>
                  </div>
                </div>
                <div className="detail-item">
                  <TimelineIcon className="icon" />
                  <div className="details-data">
                    <p className="value">₹868</p>
                    <p className="label">Profit</p>
                  </div>
                </div>
                <div className="detail-item">
                  <LocalAtmIcon className="icon" />
                  <div className="details-data">
                    <p className="value">₹17,432</p>
                    <p className="label">Cost</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card>
            <div className="card-container">
              <p className="card-title">Inventory Summary</p>
              <div className="details">
                <div className="detail-item">
                  <AttachMoneyIcon className="icon" />
                  <div className="details-data">
                    <p className="value">₹832</p>
                    <p className="label">Quantity in Hand</p>
                  </div>
                </div>
                <div className="detail-item">
                  <TrendingUpIcon className="icon" />
                  <div className="details-data">
                    <p className="value">₹18,300</p>
                    <p className="label">To be received</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} sm={7}>
          <Card>
            <div className="card-container">
              <p className="card-title">Purchase Overview</p>
              <div className="details">
                <div className="detail-item">
                  <AttachMoneyIcon className="icon" />
                  <div className="details-data">
                    <p className="value">₹832</p>
                    <p className="label">Purchase</p>
                  </div>
                </div>
                <div className="detail-item">
                  <TrendingUpIcon className="icon" />
                  <div className="details-data">
                    <p className="value">₹18,300</p>
                    <p className="label">Cost</p>
                  </div>
                </div>
                <div className="detail-item">
                  <TimelineIcon className="icon" />
                  <div className="details-data">
                    <p className="value">₹868</p>
                    <p className="label">Cancel</p>
                  </div>
                </div>
                <div className="detail-item">
                  <LocalAtmIcon className="icon" />
                  <div className="details-data">
                    <p className="value">₹17,432</p>
                    <p className="label">Return</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card>
            <div className="card-container">
              <p className="card-title">Product Summary</p>
              <div className="details">
                <div className="detail-item">
                  <Person className="icon" />
                  <div className="details-data">
                    <p className="value">32</p>
                    <p className="label">Number of Suppliers</p>
                  </div>
                </div>
                <div className="detail-item">
                  <List className="icon" />
                  <div className="details-data">
                    <p className="value">300</p>
                    <p className="label">Number of Categories</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
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
              <CartesianGrid strokeDasharray="3 3" />
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
          <div className="top-selling-stock">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2>Top Selling Stock</h2>
              <button className="see-all">See All</button>
            </div>

            <div className="table-header">
              <div className="column">Name</div>
              <div className="column">Sold Quantity</div>
              <div className="column">Remaining Quantity</div>
              <div className="column">Price</div>
            </div>
            {productData.map((item) => (
              <div key={item.name} className="table-row">
                <div className="column">{item.name}</div>
                <div className="column">{item.soldQuantity}</div>
                <div className="column">{item.remainingQuantity}</div>
                <div className="column">₹{item.price}</div>
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard;
