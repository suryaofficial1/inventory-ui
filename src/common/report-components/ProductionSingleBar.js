import { Legend } from '@devexpress/dx-react-chart'
import { Paper } from '@material-ui/core'
import React from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { product, qty, mDate, customer } = payload[0].payload
        return (
            <div style={{ background: "#fff", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
                <p style={{ padding: 8, color: "#6c63ff" }}><strong>{new Date(mDate).toLocaleDateString()} </strong> </p>
                {customer?.name && <p style={{ padding: 3, color: "#f6a623" }}><strong>Customer:</strong> {customer?.name}</p>}
                <p style={{ padding: 3, color: "#f6a623" }}><strong>Product:</strong> {product}</p>
                {/* <p style={{ padding: 3, color: "#8884d8" }}><strong>Total :</strong> ₹{pRate}</p> */}
                <p style={{ padding: 3, color: "#82ca9d" }}><strong>Quantity :</strong> {qty}</p>
            </div>
        )
    }
    return null
}


const ProductionSingleBar = ({ title, filteredData }) => {

    return (
        <Paper elevation={1} className="overview" style={{ padding: "20px" }}>
            <h3>{title}</h3>
            <div style={{ width: "100%", height: "400px" }}>
                <ResponsiveContainer>
                    <BarChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="mDate"
                            tickFormatter={(date) => new Date(date).toLocaleDateString()}
                            interval={0}
                            angle={-60}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar barSize={6} dataKey="qty" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Paper>
    )
}

export default ProductionSingleBar
