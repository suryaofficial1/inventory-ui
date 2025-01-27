import { Paper } from '@material-ui/core'
import React from 'react'
import Chart from 'react-google-charts'

const PeiChart = ({title, PeiData}) => {
    const options = {
        title: "",
        pieHole: 0.4, // Creates a Donut Chart. Does not do anything when is3D is enabled
        is3D: true, // Enables 3D view
        // slices: {
        //   1: { offset: 0.2 }, // Explodes the second slice
        // },
        pieStartAngle: 100, // Rotates the chart
        sliceVisibilityThreshold: 0.02, // Hides slices smaller than 2%
        legend: {
          position: "bottom",
          alignment: "center",
          textStyle: {
            color: "#233238",
            fontSize: 14,
          },
        },
        colors: ["#8AD1C2", "#9F8AD1", "#D18A99", "#BCD18A", "#D1C28A"],
      };
  return (
    <>
     <Paper elevation={1} className="overview" style={{ padding: "20px" }}>
              <h3>{title}</h3>
              <Chart
                chartType="PieChart"
                data={PeiData}
                options={options}
                width={"100%"}
                height={"340px"}
              />
            </Paper>
    </>
  )
}

export default PeiChart