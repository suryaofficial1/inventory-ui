import { Button, Card, Grid, Typography } from '@material-ui/core';
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
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const SalesReport = ({ formsData }) => {
  const [{ start, stop }, Loader] = useLoader();
  const [salesData, setSalesData] = useState([]);
  const pdfRef = useRef();

  console.log("fil -->", formsData)
  useEffect(() => {
    fetchSalesData();

  }, [formsData]);

  const fetchSalesData = async () => {
    try {
      start();
      const res = await sendGetRequest(`${SALES_OVERVIEW}?from=${formsData.from}&to=${formsData.to}&pId=${formsData?.product ? product.id : ""}&cId=${formsData?.customer ? customer.id : ""}`, "token");
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

  const downloadReport = () => {
    const input = pdfRef.current
    html2canvas(input).then((convas) => {
      const imgData = convas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = convas.width;
      const imgHeight = convas.height;
      const ration = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ration) / 2;
      const imgY = 30;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ration, imgHeight * ration);
      pdf.save('invoice.pdf')
    })
  }

  return (<>
    <Loader />
    <Grid container spacing={1} ref={pdfRef}>
      <Grid item sm={12}>
        <Card
          elevation={1}
          style={{
            padding: 10,
            height: 170,
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, width: "100%", height: "100%",
              backgroundImage: `url("/images/login-logo-3.png")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              opacity: 0.6, // Watermark effect
              zIndex: 0
            }}
          />
          <div className='flex space-bw'>
            <div>
              <Typography variant='h4' gutterBottom>
                <b> Sales Reports {formsData.customer.name ? "by" + " " + formsData.customer.name : ''} </b>
              </Typography>
              {formsData.product && <Typography variant='subtitle1' gutterBottom >
                <b> Product Name</b> : {formsData.product.name}
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
            </div>
            <div>
              <Button variant='outlined' color='primary' onClick={downloadReport}>Download Report</Button>
            </div>
          </div>
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
  </>
  )
}

export default SalesReport