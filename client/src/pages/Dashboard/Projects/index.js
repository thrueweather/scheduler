import React, { Fragment } from "react"
import { graphql, compose } from "react-apollo"
import moment from "moment"
import swal from "sweetalert"
import { MDBCard, MDBCardBody } from "mdbreact"

import Header from "../../../components/Header"
import TableHeader from "../../../components/Projects/ProjectTable/TableHeader"
import ProjectTable from "../../../components/Projects/ProjectTable"
import ProjectInfo from "../../../components/Projects/ProjectInfo"

import * as query from "../../../queries"
import * as path from "../../../constants/routes"
import { withAuth } from '../../../hocs/PrivateRoute'

import "../../Dashboard/Schedule/style.css"
import "../../../index.css"

class Projects extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      active: false,
      project: {},
      value: 0
    }
  }

  handleClickTransitionToCreate = () =>
    this.props.history.push(path.CREATE_PROJECT)

  handleClickModal = () => {
    this.setState({
      active: !this.state.active
    })
  }

  getItem = async item => {
    const project = await this.props.getProject.refetch({
      projectId: item.id,
      skip: false
    })
    this.setState({
      project: project.data.getProject,
      active: true
    })
  }

  handleChangeValue = (event, value) => this.setState({ value })

  handleChangeDate = type => date => {
    const data = {
      ...this.state.project,
      [type]: moment(date)
    }
    this.setState({ project: data })
  }

  handleUpdateProject = async data => {
    const response = await this.props.updateProject({
      variables: {
        projectId: data.id,
        managerId: data.managerId,
        superintendentId: data.superintendentId,
        startDate: this.state.project.startDate,
        endDate: this.state.project.endDate
      },
      refetchQueries: [{ query: query.projects }]
    })
    if (response.data.updateProject.superintendentHasProject === "true") {
      swal({
        title:
          "Superintendent already has project in this time, choose another one!",
        icon: "warning",
        buttons: "Ok",
        dangerMode: true
      })
    } else {
      this.setState({ active: false })
    }
  }

  render() {
    const { project, active, value } = this.state
    return (
      <Fragment>
        <Header title="Projects" />
        <div className="d-flex justify-content-center pt-4 p-5">
          <MDBCard style={{ width: "120rem", height: "100%" }}>
            <MDBCardBody>
              <TableHeader createProject={this.handleClickTransitionToCreate} />
              <ProjectTable getItem={this.getItem} />
              <ProjectInfo
                project={project}
                active={active}
                value={value}
                handleClickModal={this.handleClickModal}
                handleChangeValue={this.handleChangeValue}
                handleUpdateProject={this.handleUpdateProject}
                handleChangeDate={this.handleChangeDate}
              />
            </MDBCardBody>
          </MDBCard>
        </div>
      </Fragment>
    )
  }
}

export default compose(
  graphql(query.projects, { name: "getProjects" }),
  graphql(query.getProject, {
    name: "getProject",
    options: { variables: { skip: true } }
  }),
  graphql(query.updateProject, { name: "updateProject" })
)(withAuth(Projects))
