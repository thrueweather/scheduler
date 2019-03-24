import React from "react"
import { Query } from "react-apollo"

import { MDBCard } from "mdbreact"

import { getUsers } from "../../queries"

import "./index.css"

const GetUsers = () => (
  <Query query={getUsers} variables={{ role: "ALL", skip: false }}>
    {({ loading, error, data }) => {
      if (loading) return <div>Loading...</div>;
      if (error) return `Error! ${error.message}`
      return (
        <MDBCard className="card-body data-count">
          <h3>Users: {data.users.length}</h3>
        </MDBCard>
      )
    }}
  </Query>
)

export default GetUsers
