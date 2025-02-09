import React from "react";

const ReportTables = ({ title, headers, rows, showAll, showAllLink, columnMapping, formatCell }) => {

  return (
    <div className="top-selling-stock">
      {/* Title and "See All" Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 20, marginBottom: "20px" }}>
        <h2>{title}</h2>
        {showAll && <button className="see-all"><a href={showAllLink}>{showAll}</a></button>}
      </div>

      {/* Table Header */}
      <div className="table-header">
        {headers.map((header) => (
          <div key={header} className="column">
            {header}
          </div>
        ))}
      </div>

      {/* Table Rows */}
      {rows && rows.length > 0 ? (
        rows.map((row, index) => (
          <div key={index} className="table-row">
            {headers.map((header) => {
              // Find corresponding key in row
              const key = columnMapping[header] || header;
              const cellValue = row[key];

              return (
                <div key={header} className="row">
                  {formatCell ? formatCell(header, cellValue, row) : cellValue}
                </div>
              );
            })}
          </div>
        ))
      ) : (
        <div className="no-data">No data available</div>
      )}
    </div>
  );
};

export default ReportTables;
