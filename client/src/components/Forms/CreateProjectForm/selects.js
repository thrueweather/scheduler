import React, { Fragment } from "react"

import { MDBCol } from "mdbreact"
import { Query } from "react-apollo"

import { getUsers, getPersons } from "../../../queries"

const Selects = () => (
  <Fragment>
    <MDBCol md="6">
      <label>Superintendent</label>
      <Query query={getPersons} variables={{ role: "SUPERINTENDENT", skip: false }}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>{`Error! ${error.message}`}</p>
          return (
            <select
              id="superintendentId"
              name="superintendentId"
              className="browser-default custom-select position-relative form-group"
            >
              {data.persons.map(person => (
                <option key={person.id} value={person.id}>
                  {person.firstName}
                </option>
              ))}
            </select>
          )
        }}
      </Query>
    </MDBCol>
    <MDBCol md="6">
      <label>Manager</label>
      <Query
        query={getUsers}
        variables={{ role: "PROJECT_MANAGER", skip: false }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>{`Error! ${error.message}`}</p>
          return (
            <select
              id="managerId"
              name="managerId"
              className="browser-default custom-select position-relative form-group"
            >
              {data.users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName}
                </option>
              ))}
            </select>
          )
        }}
      </Query>
    </MDBCol>
  </Fragment>
)

export default Selects
