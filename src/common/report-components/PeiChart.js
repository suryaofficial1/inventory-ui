import { Paper } from "@material-ui/core";
import React from "react";
import Chart from "react-google-charts";

const PeiChart = ({ title, data = [] }) => {
  
  // Check if data is an array and has data
  if (!Array.isArray(data) || data.length === 0) {
    return <p style={{ textAlign: "center", color: "red" }}>No data available</p>;
  }
  
  // Convert data into Google Charts format
  const chartData = [["Unit", "Quantity"], ...data && data.map(({ unit, quantity }) => [unit, quantity])];
  console.log("chartData", chartData);

  const options = {
    title: title || "Unit Distribution",
    pieHole: 0.4,
    is3D: true,
    pieStartAngle: 100,
    sliceVisibilityThreshold: 0.02,
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "#233238",
        fontSize: 14,
      },
    },
    // colors: ["#8AD1C2", "#9F8AD1", "#D18A99", "#BCD18A", "#D1C28A"], // Custom colors
  };

  return (
    <Paper elevation={1} className="overview" style={{ padding: "20px" }}>
      <h3>{title || "Pie Chart"}</h3>
      <Chart chartType="PieChart" data={chartData} options={options} width={"100%"} height={"340px"} />
    </Paper>
  );
};

export default PeiChart;
