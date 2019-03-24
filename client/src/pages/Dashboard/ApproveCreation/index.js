import React, { Fragment } from "react"
import { Query, compose, graphql } from "react-apollo"

import NumberFormat from "react-number-format"
import moment from "moment"

import Header from "../../../components/Header"
import Loader from "../../../components/Loader"
import { MDBBtn, MDBCard } from "mdbreact"
import swal from "sweetalert"
import IosArrowDropright from "react-ionicons/lib/IosArrowDropright"

import {
  getProject,
  approveProjectCreation,
  projects,
  pendingCreationProjects,
  me
} from "../../../queries"

import * as path from "../../../constants/routes"
import { withAuth } from "../../../hocs/PrivateRoute"

const ApproveCreation = props => {
  const handleClick = boolean =>
    props
      .approveProject({
        variables: {
          projectId: props.match.params.id,
          approve: boolean
        },
        refetchQueries: [
          { query: projects },
          { query: pendingCreationProjects }
        ]
      })
      .then(response => {
        if (response.data.approveProjectCreation.errors.length > 0) {
          swal({
            title: "Error",
            text: `${response.data.approveProjectCreation.errors[0]}`,
            icon: "warning",
            dangerMode: true
          })
        }
        response.data.approveProjectCreation.success &&
          props.history.push(path.SCHEDULE)
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
                  <ul>
                    {" "}
                    Address
                    <IosArrowDropright
                      color="#2196f3"
                      style={{ marginRight: "10px" }}
                    />
                    {data.getProject.address
                      ? data.getProject.address.line1
                      : "N/A"}
                  </ul>
                  <ul>
                    {" "}
                    Project Number
                    <IosArrowDropright
                      color="#2196f3"
                      style={{ marginRight: "10px" }}
                    />
                    {data.getProject.number}
                  </ul>
                  <ul>
                    {" "}
                    Value
                    <IosArrowDropright
                      color="#2196f3"
                      style={{ marginRight: "10px" }}
                    />
                    <NumberFormat
                      value={data.getProject.value}
                      thousandSeparator={true}
                      displayType={"text"}
                      renderText={value => <span> ${value}</span>}
                    />
                  </ul>
                  <ul>
                    {" "}
                    Project manager
                    <IosArrowDropright
                      color="#2196f3"
                      style={{ marginRight: "10px" }}
                    />
                    {data.getProject.manager.firstName}{" "}
                    {data.getProject.manager.lastName}
                  </ul>
                  <ul>
                    {" "}
                    Assistant manager
                    <IosArrowDropright
                      color="#2196f3"
                      style={{ marginRight: "10px" }}
                    />
                    {data.getProject.assistantmanager
                      ? `${data.getProject.assistantmanager.firstName} ${
                          data.getProject.assistantmanager.lastName
                        }`
                      : "N/A"}
                  </ul>
                  <ul>
                    {" "}
                    Superintendent
                    <IosArrowDropright
                      color="#2196f3"
                      style={{ marginRight: "10px" }}
                    />
                    {data.getProject.superintendent
                      ? `${data.getProject.superintendent.firstName} ${
                          data.getProject.superintendent.lastName
                        }`
                      : "N/A"}
                  </ul>
                  <ul>
                    {" "}
                    MEP
                    <IosArrowDropright
                      color="#2196f3"
                      style={{ marginRight: "10px" }}
                    />
                    {data.getProject.mep
                      ? `${data.getProject.mep.firstName} ${
                          data.getProject.mep.lastName
                        }`
                      : "N/A"}
                  </ul>
                  <ul>
                    {" "}
                    Construction Manager
                    <IosArrowDropright
                      color="#2196f3"
                      style={{ marginRight: "10px" }}
                    />
                    {data.getProject.constructionmanager
                      ? `${data.getProject.constructionmanager.firstName} ${
                          data.getProject.constructionmanager.lastName
                        }`
                      : "N/A"}
                  </ul>
                  <ul>
                    {" "}
                    Architect
                    <IosArrowDropright
                      color="#2196f3"
                      style={{ marginRight: "10px" }}
                    />
                    {data.getProject.architect
                      ? `${data.getProject.architect.firstName} ${
                          data.getProject.architect.lastName
                        }`
                      : "N/A"}
                  </ul>
                  <ul>
                    {" "}
                    Start date
                    <IosArrowDropright
                      color="#2196f3"
                      style={{ marginRight: "10px" }}
                    />
                    {moment(data.getProject.startDate).format("YYYY-MM-DD")}
                  </ul>
                  <ul>
                    {" "}
                    End date
                    <IosArrowDropright
                      color="#2196f3"
                      style={{ marginRight: "10px" }}
                    />
                    {moment(data.getProject.endDate).format("YYYY-MM-DD")}
                  </ul>

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
  graphql(approveProjectCreation, { name: "approveProject" }),
  graphql(me, { name: "user" })
)(withAuth(ApproveCreation))
