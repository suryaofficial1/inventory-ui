import { LinearProgress, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import React from 'react'
import { ResponsiveContainer } from 'recharts';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress);

const ProgressBarChart = ({ title, productData }) => {
    return (
        <>
            <Paper elevation={1} style={{ padding: "20px", height: 400 }} className="quantity-chart">
                <h3>{title}</h3>
                <ResponsiveContainer width="100%" height="100%" >
                    {productData && productData.slice(0, 6).map((item, index) => (
                        <div style={{ margin: 15 }} key={index}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>

                                <label>{item.pName}</label>
                                <label>{item.quantity}</label>
                            </div>
                            <BorderLinearProgress variant="determinate" value={item.quantity} />
                        </div>
                    ))}
                    {productData && productData.length > 6 && (
                        <p style={{ textAlign: "center", color: "red" }}>Only 6 data are shown</p>
                    )}
                </ResponsiveContainer>
            </Paper>
        </>
    )
}

export default ProgressBarChart