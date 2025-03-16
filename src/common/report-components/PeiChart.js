import { Paper } from "@material-ui/core";
import React from "react";
import Chart from "react-google-charts";

const PeiChart = ({ title, data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p style={{ textAlign: "center", color: "red" }}>No data available</p>;
  }
  const chartData = [["product", "qty"], ...data.map(({ product, qty }) => [product.name, Number(qty)])];

  const options = {
    title: "",
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
  };

  return (
    <Paper elevation={1} className="overview" style={{ padding: "20px" }}>
      <h3>{title || "Pie Chart"}</h3>
      <Chart chartType="PieChart" data={chartData} options={options} width={"100%"} height={"350px"} />
    </Paper>
  );
};

export default PeiChart;
