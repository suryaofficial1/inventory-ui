import { Paper } from '@material-ui/core'
import React from 'react'

const OverviewCards = ({ title, data }) => {
    return (
        <>
            <Paper elevation={1} className='overview'>
                <div className='overview'>
                    <h4>{title}</h4>
                </div>
                <div className='overview-details'>
                    {data && data.map((item, index) => (
                        <div key={index} className='overview-list'>
                            <div className='text-center'>
                                <div className='overview-icon'>
                                    {item.icon}
                                </div>
                                <div className='overview-details'>
                                    <span className='overview-info font-weight-600'>{item.value}</span>
                                    <span className='overview-info'>{item.title}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Paper>
        </>
    )
}

export default OverviewCards