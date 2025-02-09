import { Card, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from "react";
import { sendGetRequest } from '../../../utils/network';
import { SALES_OVERVIEW } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import OverviewCards from '../../../common/report-components/OverviewCards';
import SingleBarChart from '../../../common/report-components/SingleBarChart';
import PeiChart from '../../../common/report-components/PeiChart';
import ProgressBarChart from '../../../common/report-components/ProgressBarChart';
import ReportTables from '../../../common/report-components/ReportTables';
import { CardGiftcard, Money, People, Store } from '@material-ui/icons';

const SalesReport = ({ formsData }) => {
  const [{ start, stop }, Loader] = useLoader();
  const [salesData, setSalesData] = useState([]);

  console.log("fil -->", formsData)
  useEffect(() => {
    fetchSalesData();

  }, [formsData]);

  const fetchSalesData = async () => {
    try {
      start();
      const res = await sendGetRequest(`${SALES_OVERVIEW}?from=${formsData.from}&to=${formsData.to}&pId=${formsData.pId}&cId=${formsData.cId}`, "token");
      if (res.status === 200) {
        setSalesData(res.data);
      }
    } catch (err) {
      console.error("Error fetching sales data", err);
    } finally {
      stop();
    }
  };


  const customOverViewData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const { orders, sales, customers } = data[0];

    const overviewData = [
      customers !== undefined && { title: "Customer", value: customers, icon: <People /> },
      { title: "Order", value: orders, icon: <Store /> },
      { title: "Sales", value: `₹${sales}`, icon: <Money /> },
      {
        title: "Average Order",
        value: orders ? `₹${(sales / orders).toFixed(2)}` : "N/A",
        icon: <CardGiftcard />,
      },
    ].filter(Boolean);

    return overviewData;
  };

  const columnMapping = {
    "id": "id",
    "Customer Name": "cName",
    "Product Name": "pName",
    "Quantity": "qty",
    "Sales Price": "s_price",
    "Sales Date": "s_date",
    "Unit": "unit",
    "Status": "status",
  };

  // Format cells (for date and currency)
  const formatCell = (header, value, row) => {
    if (header === "Sales Date") {
      return new Date(value).toLocaleDateString(); // Convert ISO to readable date
    }
    if (header === "Sales Price") {
      return `₹${value}`; // Format as currency
    }
    return value;
  };

  return (
    <Grid container spacing={1}>
      <Grid item sm={12}>
        <Card elevation={1} style={{padding: 10}}>
        <Typography variant='h4' gutterBottom>
           <b> Sales Report by Customer </b> 
          </Typography>
          {formsData.cId && <Typography variant='subtitle1' gutterBottom >
            <b>Custom Name</b> : {formsData.cId}
          </Typography>}
          {formsData.pId && <Typography variant='subtitle1' gutterBottom >
            <b> Product Name</b> : {formsData.pId}
          </Typography>}
          {formsData.from && <>
            <Typography variant='subtitle1' gutterBottom >
            <b>Start Date</b> : {formsData.from}
          </Typography>
          <Typography variant='subtitle1' gutterBottom >
            <b>End Date</b> : {formsData.to}
          </Typography>
          </>
          }
        </Card>
      </Grid>
      <Grid item sm={12}>
        <OverviewCards title="Sales Overview" data={customOverViewData(salesData.overView)} />
      </Grid>
      <Grid item sm={12}>
        <SingleBarChart title="Sales Report" filteredData={salesData.totalSallProduct} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <PeiChart title="Product Sales by Unit" data={salesData.prdSellByUnit} />
      </Grid>
      <Grid item xs={12} sm={6} >
        <ProgressBarChart title="Product Sales by quantity" productData={salesData.prdSellByQty} />
      </Grid>
      <Grid item xs={12}>
        <ReportTables title="Top Selling Stock"
          headers={["id", "Customer Name", "Product Name", "Quantity", "Sales Price", "Sales Date", "Unit", "Status"]}
          rows={salesData.allSallData}
          showAll="See All"
          showAllLink="#sales"
          columnMapping={columnMapping}
          formatCell={formatCell}
        />
      </Grid>
    </Grid>
  )
}

export default SalesReport