import { Legend } from '@devexpress/dx-react-chart'
import { Paper, Tooltip } from '@material-ui/core'
import React from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const SingleBarChart = ({title, filteredData}) => {
  return (
    <>
    <Paper elevation={1} className="overview" style={{ padding: "20px" }}>
              <h3>{title}</h3>
              <div style={{ width: "100%", height: "400px" }}>
                <ResponsiveContainer>
                  <BarChart data={filteredData}>
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
                    <Bar barSize={10} dataKey="Sales" fill="#0066a2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Paper>
    </>
  )
}

export default SingleBarChart