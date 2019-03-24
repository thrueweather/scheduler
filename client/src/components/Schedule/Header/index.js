import React from "react"

const ScheduleHeader = ({ title, children }) => (
  <div className="table-header flex" style={{ backgroundColor: "#fff" }}>
    <h4>{title}</h4>
    {children}
  </div>
)

export default ScheduleHeader
