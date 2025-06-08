import { Card, CardHeader, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ProductionSingleBar from '../../../common/report-components/ProductionSingleBar';
import ProgressBar from '../../../common/report-components/ProgressBar';
import { ALL_STATS_COUNT, PRODUCTION_SUMMARY, TOP_5_PRODUCTS } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { sendGetRequest } from '../../../utils/network';
import DashboardCards from './DashboardCards';

const useStyles = makeStyles((theme) => ({
  card: {
    background: "#a7606091",
    padding: 3,
    height: 110,
    [theme.breakpoints.down("sm")]: {
      height: 100,
      padding: 1
    }

  },
  topSellingCard: {
    padding: theme.spacing(2),
    height: 200
  },
  image: {
    width: 60, height: 60,
    padding: 10,
    [theme.breakpoints.down("sm")]: {
      width: 40, height: 40,
      padding: 5
    }

  },
  title: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#fff",
  },
  subTitle: {
    fontSize: "0.9rem",
    fontWeight: "800",
    color: "#fff",
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("weekly");
  const [productionSummary, setProductionSummary] = useState([]);
  const [counts, setAllCounts] = useState([]);
  const [top5Product, setTop5Product] = useState([]);

  const [{ start, stop }, Loader] = useLoader();
  const user = useSelector((state) => state.user);



  useEffect(() => {
    fetchData()
  }, []);
  const fetchData = async () => {
    try {
      start();
      const [countsRes, top5Res, productionRes] = await Promise.all([
        sendGetRequest(ALL_STATS_COUNT, user.token),
        sendGetRequest(TOP_5_PRODUCTS, user.token),
        sendGetRequest(PRODUCTION_SUMMARY, user.token),
      ]);
      if (countsRes.status === 200) setAllCounts(countsRes.data);
      if (top5Res.status === 200) setTop5Product(top5Res.data);
      if (productionRes.status === 200) setProductionSummary(productionRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      stop();
    }
  };


  const top5ProductSection = (title, data) => {
    return (
      <Card elevation={2} className={classes.topSellingCard}>
        <Grid container spacing={3}>
          <Grid item sm={12} align="center">
            <Typography gutterBottom variant='h5'><b>{title}</b></Typography>
          </Grid>
          <Grid container item sm={12} spacing={1}>
            {data && data.map((item, index) => {
              return <Grid container item sm={12} spacing={1} key={index}>
                <Grid item sm={3} align="right">
                  <Typography variant="body2">{item.product}</Typography>
                </Grid>
                <Grid item sm={7}>
                  <ProgressBar value={item.qty} price={item.price} prefix="₹" />
                </Grid>
                <Grid item sm={2}>
                  <Typography variant="body2">{item.qty}</Typography>
                </Grid>
              </Grid>
            })}
          </Grid>
        </Grid>
      </Card>
    )
  }

  return (
    <>
      <Loader />
      <Grid container spacing={1}>
        <Grid item xs={12}>
        <DashboardCards data={counts} />
        </Grid>
        <Grid item sm={12}>
          <ProductionSingleBar title={"Production Summary"} filteredData={productionSummary} />
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard;
