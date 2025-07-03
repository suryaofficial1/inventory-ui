import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ProductionSingleBar from '../../../common/report-components/ProductionSingleBar';
import { ALL_STATS_COUNT, PRODUCTION_SUMMARY } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { sendGetRequest } from '../../../utils/network';
import DashboardCards from './DashboardCards';


const Dashboard = () => {
  const dispatch = useDispatch();
  const [productionSummary, setProductionSummary] = useState([]);
  const [counts, setAllCounts] = React.useState([]);

  const [{ start, stop }, Loader] = useLoader();
  const user = useSelector((state) => state.user);



  useEffect(() => {
    fetchData()
  }, []);
  const fetchData = async () => {
    try {
      start();
      const [countsRes, productionRes] = await Promise.all([
        sendGetRequest(ALL_STATS_COUNT, user.token),
        sendGetRequest(PRODUCTION_SUMMARY, user.token),
      ]);
      if (countsRes.status === 200) setAllCounts(countsRes.data);
      if (productionRes.status === 200) setProductionSummary(productionRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      stop();
    }
  };


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
