import React from "react"
import IosAddCircleOutline from "react-ionicons/lib/IosAddCircleOutline"

import "./style.css"

const TableHeader = ({ title, createProject }) => (
  <div className="table-header" style={{ backgroundColor: "#fff" }}>
    <h4>{title}</h4>
    <IosAddCircleOutline
      onClick={createProject}
      fontSize="30px"
      color="#007bff"
    />
  </div>
)

export default TableHeader
