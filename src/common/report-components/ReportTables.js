import React from 'react'

const ReportTables = ({ title, headers, rows, showAll, showAllLink }) => {
    return (
        <>
            <div className="top-selling-stock">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 20, marginBottom: "20px" }}>
                    <h2>{title}</h2>
                    {showAll && <button className="see-all"> <a href={showAllLink}>{showAll}</a></button>}
                </div>

                <div className="table-header">
                    {headers.map((header) => (
                        <div key={header} className="column">
                            {header}
                        </div>
                    ))}
                </div>
                {rows.map((row, index) => (
                    <div key={index} className="table-row">
                        {headers.map((header) => (
                            <div key={header} className="row">
                                {row[header]}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    )
}

export default ReportTables