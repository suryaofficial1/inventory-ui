import { Card, Grid, Typography } from '@material-ui/core';
import { CardGiftcard, Money, People, Store } from '@material-ui/icons';
import React, { useEffect, useState } from "react";
import OverviewCards from '../../../common/report-components/OverviewCards';
import PeiChart from '../../../common/report-components/PeiChart';
import ProgressBarChart from '../../../common/report-components/ProgressBarChart';
import ReportTables from '../../../common/report-components/ReportTables';
import SingleBarChart from '../../../common/report-components/SingleBarChart';
import { PURCHASE_REPORT } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { sendGetRequest } from '../../../utils/network';
import { useSelector } from 'react-redux';

const PurchaseReport = ({ formsData }) => {
  const [{ start, stop }, Loader] = useLoader();
  const [salesData, setSalesData] = useState([]);
  const user = useSelector((state) => state.user);


  console.log("fil -->", formsData)
  useEffect(() => {
    fetchSalesData();

  }, [formsData]);

  const fetchSalesData = async () => {
    try {
      start();
      const res = await sendGetRequest(`${PURCHASE_REPORT}?from=${formsData.from}&to=${formsData.to}&pId=${formsData.pId}&sId=${formsData.sId}`, user.token);
      if (res.status === 200) {
        setSalesData(res.data);
      }
    } catch (err) {
      console.error("Error fetching purchase data", err);
    } finally {
      stop();
    }
  };

  const customOverViewData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const { product_purchase, purchaseValue, supplier } = data[0];

    const overviewData = [
      supplier !== undefined && { title: "Supplier", value: supplier, icon: <People /> },
      { title: "Product Purchase", value: product_purchase, icon: <Store /> },
      { title: "Purchase Value", value: `₹${purchaseValue}`, icon: <Money /> },
      {
        title: "Average Purchase",
        value: purchaseValue ? `₹${(purchaseValue / product_purchase).toFixed(2)}` : "N/A",
        icon: <CardGiftcard />,
      },
    ].filter(Boolean);

    return overviewData;
  };

  const columnMapping = {
    "id": "id",
    "Supplier Name": "sName",
    "Product Name": "pName",
    "Quantity": "qty",
    "Price": "price",
    "Date": "p_date",
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
        <Card elevation={1} style={{ padding: 10 }}>
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
        <OverviewCards title="Purchase Overview" data={customOverViewData(salesData.overView)} />
      </Grid>
      <Grid item sm={12}>
        <SingleBarChart title="Purchase Report" filteredData={salesData.totalPurchaseProduct} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <PeiChart title="Product Purchase by Unit" data={salesData.prdPurchaseByUnit} />
      </Grid>
      <Grid item xs={12} sm={6} >
        <ProgressBarChart title="Product Purchase by quantity" productData={salesData.prdPurchaseByQty} />
      </Grid>
      <Grid item xs={12}>
        <ReportTables title="Top Purchase Product"
          headers={["id", "Supplier Name", "Product Name", "Quantity", "Price", "Date", "Unit", "Status"]}
          rows={salesData.allPurchaseData}
          showAll="See All"
          showAllLink="#sales"
          columnMapping={columnMapping}
          formatCell={formatCell}
        />
      </Grid>
    </Grid>
  )
}

export default PurchaseReport