import React from "react"
import { Query } from "react-apollo"

import Loader from "../../Loader"
import {
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBTableBody,
  MDBCardTitle
} from "mdbreact"
import Manager from "./Manager"

import { getUsers } from "../../../queries"

export default function Managers() {
  return (
    <Query
      query={getUsers}
      variables={{ role: "PROJECT_MANAGER", skip: false }}
    >
      {({ loading, error, data }) => {
        if (loading) return <Loader />
        if (error) return <p>{`Error! ${error.message}`}</p>
        const { users } = data
        return (
          <MDBCard className="card-manager">
            <MDBCardBody>
              <MDBCardTitle>Project Managers</MDBCardTitle>
              <MDBTable>
                <MDBTableBody>
                  {users.map(manager => (
                    <Manager key={manager.id} manager={manager} />
                  ))}
                </MDBTableBody>
              </MDBTable>
            </MDBCardBody>
          </MDBCard>
        )
      }}
    </Query>
  )
}
