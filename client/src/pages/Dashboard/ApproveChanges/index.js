import React, { Fragment } from "react"

import { Query, compose, graphql } from "react-apollo"
import Header from "../../../components/Header"
import Loader from '../../../components/Loader'
import { MDBBtn, MDBCard } from "mdbreact"
import swal from "sweetalert"
import IosArrowDropright from "react-ionicons/lib/IosArrowDropright"

import {
  getProject,
  approveProjectChanges,
  projects,
  pendingChangesProjects,
  me
} from "../../../queries"

import * as path from "../../../constants/routes"
import { withAuth } from '../../../hocs/PrivateRoute'

const ApproveChanges = props => {
  const handleClick = boolean =>
    props
      .approveProject({
        variables: {
          projectId: props.match.params.id,
          approve: boolean
        },
        refetchQueries: [{ query: projects }, { query: pendingChangesProjects }]
      })
      .then(response => {
        if (response.data.approveProjectChanges.errors && response.data.approveProjectChanges.errors.length > 0) {
          swal({
            title: "Error",
            text: `${response.data.approveProjectChanges.errors[0]}`,
            icon: "warning",
            dangerMode: true
          })
        }
        response.data.approveProjectChanges.success && props.history.push(path.SCHEDULE)
      })
  if (props.user.loading) return null
  return (
    <Fragment>
      <Header title="Approve Changes" />
      <div className="p-5 approve-changes-wrapp">
          <Query
            query={getProject}
            variables={{ projectId: props.match.params.id, skip: false }}
            fetchPolicy="cache-and-network"
          >
            {({ loading, error, data }) => {
              if (loading) return <Loader />
              if (error) return <p>{`Error! ${error.message}`}</p>
              return (
                <MDBCard style={{ width: "45rem" }}>
                  <div className="card-body">
                    <p>Project name: {data.getProject.name}</p>
                    {data.getProject.changesList.map((item, index) => (
                      <ul key={index} style={{ display: "flex" }}>
                        <IosArrowDropright
                          color="#2196f3"
                          style={{ marginRight: "10px" }}
                        />
                        {item}
                      </ul>
                    ))}
                    <MDBBtn
                      color="success"
                      disabled={props.user.me.role !== "ADMIN"}
                      style={{ marginLeft: 0 }}
                      onClick={() => handleClick(true)}
                    >
                      Accept
                    </MDBBtn>
                    <MDBBtn
                      color="danger"
                      disabled={props.user.me.role !== "ADMIN"}
                      onClick={() => handleClick(false)}
                    >
                      Decline
                    </MDBBtn>
                  </div>
                </MDBCard>
              )
            }}
          </Query>
      </div>
    </Fragment>
  )
}

export default compose(
  graphql(approveProjectChanges, { name: "approveProject" }),
  graphql(me, { name: "user" })
)(withAuth(ApproveChanges))
