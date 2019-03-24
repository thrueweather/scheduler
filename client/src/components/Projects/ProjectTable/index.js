import React from "react"

import { MDBIcon } from "mdbreact"
import { Query } from "react-apollo"
import Loader from "../../Loader"
import Table from "../../Table"

import { projects } from "../../../queries"

const ProjectsTable = ({ getItem }) => {
  const projectColumns = [
    {
      columns: [
        {
          Header: "Name",
          accessor: "name"
        },
        {
          Header: "Start date",
          Cell: row => row.original.startDate.slice(0, 10)
        },
        {
          Header: "End date",
          Cell: row => row.original.endDate.slice(0, 10)
        },
        {
          Header: "Manager",
          Cell: row =>
            `${row.original.manager.firstName} ${
              row.original.manager.lastName
            }`
        },
        {
          Header: "Superintendent",
          Cell: row => {
            if (row.original.superintendent) {
              return `${row.original.superintendent.firstName} ${
                row.original.superintendent.lastName
              }`
            }
            return "Unassigned"
          }
        },
        {
          Header: "Edit",
          Cell: row => (
            <MDBIcon
              onClick={() => getItem(row.original)}
              icon="edit"
              style={{ cursor: "pointer" }}
            />
          )
        }
      ]
    }
  ]
  return (
    <Query query={projects}>
      {({ data, loading }) => {
        if (loading) return <Loader />
        const { projects } = data
        return <Table columns={projectColumns} items={projects} />
      }}
    </Query>
  )
}

export default ProjectsTable
