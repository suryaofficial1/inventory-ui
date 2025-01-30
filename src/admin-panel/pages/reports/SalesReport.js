import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from "react";
import { CardGiftcard, Money, People, Store } from '@material-ui/icons';
import OverviewCards from '../../../common/report-components/OverviewCards';
import PeiChart from '../../../common/report-components/PeiChart';
import ProgressBarChart from '../../../common/report-components/ProgressBarChart';
import ReportTables from '../../../common/report-components/ReportTables';
import SingleBarChart from '../../../common/report-components/SingleBarChart';
import { sendGetRequest } from '../../../utils/network';
import { SALES_OVERVIEW } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { useSelector } from 'react-redux';


const SalesReport = (formsData) => {
  console.log("formsData", formsData)
  const [{ start, stop }, Loader, loading] = useLoader();
  const user = useSelector((state) => state.user);

  const [salesData, setSalesData] = useState([])
  const [filter, setFilter] = useState({ from: '', to: '' });

  useEffect(() => {
    getSales();
  }, []);
  const getSales = () => {
    start()
    sendGetRequest(`${SALES_OVERVIEW}?from=${filter.from}&to=${filter.to}&pName=${filter.pName}`, "token")
      .then(res => {
        if (res.status === 200) {
          setSalesData(res.data)
        } else {
          console.log(res)
        }
      }).catch(err => {
        console.log(err)
      }).finally(stop)
  }


  const fromDate = "2024-11-12";
  const toDate = "2025-04-10";



  const customOverViewData = (data) => {
    console.log("data", data);

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
    id: "id",
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