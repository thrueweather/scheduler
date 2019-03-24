import React from "react"
import ReactTable from "react-table"

import "react-table/react-table.css"

const Table = ({ columns, loading, items }) => (
  <ReactTable
    columns={columns}
    loading={loading}
    data={items}
    defaultPageSize={10}
    className="-striped -highlight table"
  />
)

export default Table
