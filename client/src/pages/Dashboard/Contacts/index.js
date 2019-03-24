import React, { useState, useEffect, Fragment } from "react"
import { compose, graphql } from "react-apollo"
import { MDBCard, MDBCardBody } from "mdbreact"

import Header from "../../../components/Header"
import Table from "../../../components/Table"
import Loader from '../../../components/Loader'

import { contactColumns } from "../../../utils/api"
import { withAuth } from '../../../hocs/PrivateRoute'
import { getUsers, getPersons } from "../../../queries"

import "../../../components/Projects/ProjectTable/TableHeader/style.css"

const Contacts = props => {
  const [data, setData] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const getManagers = await props.projectManagers.refetch({
          role: "PROJECT_MANAGER",
          skip: false
        })
        const getSuperintendents = await props.superintendents.refetch({
          role: "SUPERINTENDENT",
          skip: false
        })
        const result = await Promise.all([
          ...getManagers.data.users,
          ...getSuperintendents.data.persons
        ])
        setData((data.items = result))
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])
  
  return (
    <Fragment>
      <Header title="Contacts" />
      <div className="d-flex justify-content-center pt-4 p-5">
        <MDBCard style={{ width: "120rem", height: "100%" }}>
          <MDBCardBody>
            {data.length > 0 
              ? <Table columns={contactColumns} items={data} />
              : <Loader/>}
          </MDBCardBody>
        </MDBCard>
      </div>
    </Fragment>
  )
}

export default compose(
  graphql(getUsers, {
    name: "projectManagers",
    options: { variables: { skip: true } }
  }),
  graphql(getPersons, {
    name: "superintendents",
    options: { variables: { skip: true } }
  })
)(withAuth(Contacts))
