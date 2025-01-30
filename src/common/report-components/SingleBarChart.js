import { Legend } from '@devexpress/dx-react-chart'
import { Paper } from '@material-ui/core'
import React from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, total, qty, date } = payload[0].payload
    return (
      <div style={{ background: "#fff", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <p style={{ padding: 8, color: "#6c63ff" }}><strong>{new Date(date).toLocaleDateString()} </strong> </p>
        <p style={{ padding: 3, color: "#f6a623" }}><strong>Product:</strong> {name}</p>
        <p style={{ padding: 3, color: "#8884d8" }}><strong>Total :</strong> ${total}</p>
        <p style={{ padding: 3, color: "#82ca9d" }}><strong>Quantity :</strong> {qty}</p>
      </div>
    )
  }
  return null
}


const SingleBarChart = ({ title, filteredData }) => {
  return (
    <Paper elevation={1} className="overview" style={{ padding: "20px" }}>
      <h3>{title}</h3>
      <div style={{ width: "100%", height: "400px" }}>
        <ResponsiveContainer>
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
              interval={0}
              angle={-60}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar barSize={10} dataKey="total" fill="#8884d8" />
            <Bar barSize={6} dataKey="qty" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  )
}

export default SingleBarChart
