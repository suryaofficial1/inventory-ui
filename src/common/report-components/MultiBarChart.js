import { Paper } from '@material-ui/core'
import React from 'react'
import { Bar, BarChart, CartesianGrid, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const MultiBarChart = ({ title, data }) => {
    return (
        <>
            <Paper elevation={1} className="overview" style={{ padding: "20px" }}>
                <h3>{title}</h3>
                <div style={{ width: "100%", height: "400px" }}>
                    <ResponsiveContainer>
                        <BarChart width={500} height={300} data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                interval={0}
                                angle={-60}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Purchase" fill="#8884d8" />
                            <Bar dataKey="Sales" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Paper>
        </>
    )
}

export default MultiBarChart