import React, { useState } from "react"
import swal from "sweetalert"
import moment from "moment"

import { Query, graphql } from "react-apollo"
import {
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCardTitle,
  MDBIcon,
  Button
} from "mdbreact"
import Modal from "../../../components/Modal"
import CustomDatePicker from "../../DatePicker"

import {
  projects,
  pendingChangesProjects,
  getPersons,
  getUsers,
  updateProject
} from "../../../queries"
import { timeInterval, withPromise } from "../../../utils"
import { unassignedColumns } from "../../../utils/api"

const UnassignedProjects = props => {
  const [project, getProject] = useState({})
  const [assignModal, switchModal] = useState(false)
  const margin = { margin: "10px 0 0 0" }
  const handleClick = async unassigned => {
    await withPromise(getProject((project.data = unassigned)))
    switchModal(true)
  }
  const sendDate = async () => {
    const superintendent = document.getElementById("superintendentId").value
    const response = await props.updateProject({
      variables: {
        projectId: project.id,
        managerId: project.manager.id,
        superintendentId: superintendent,
        startDate: project.startDate,
        endDate: project.endDate,
        calculateId: false
      },
      refetchQueries: [{ query: projects }, { query: pendingChangesProjects }]
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
      return switchModal(false)
    }
  }
  const handleChangeDate = type => date => {
    const data = {
      ...project,
      [type]: moment(date)
    }
    getProject(data)
  }
  const showCountWeek =
    timeInterval(project.endDate, project.startDate, "day", true) / 5

  return (
    <div className="unassigned-projects">
      <MDBCard style={{ marginTop: "1rem" }}>
        <MDBCardBody>
          <MDBCardTitle>Unassigned Projects</MDBCardTitle>
          <MDBTable>
            <MDBTableHead columns={unassignedColumns} />
            <MDBTableBody>
              {props.unassignedProjects.map(unassigned => (
                <tr key={unassigned.id}>
                  <td>{unassigned.id}</td>
                  <td>{unassigned.name}</td>
                  <td>{unassigned.startDate.slice(0, 10)}</td>
                  <td>{unassigned.endDate.slice(0, 10)}</td>
                  {
                    <td>
                      {unassigned.manager.firstName}
                      {unassigned.manager.lastName}
                    </td>
                  }
                  <td>{!unassigned.superintendent && "Unassigned"}</td>
                  <td>
                    <MDBIcon
                      icon="user-plus"
                      onClick={() => handleClick(unassigned)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>
      <Modal
        isActive={assignModal}
        title={`Assign superintendent to ${project.name}`}
        closeModal={() => switchModal(false)}
      >
        <div className="card">
          <div className="card-body">
            <label>Superintendents</label>
            <Query
              query={getPersons}
              variables={{ role: "SUPERINTENDENT", skip: false }}
            >
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
            <label>Managers</label>
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
            <div className="flex position-relative form-group">
              <CustomDatePicker
                title="Start date"
                selected={moment(project.startDate).toDate()}
                onChange={handleChangeDate("startDate")}
              />
              <div className="center">
                {showCountWeek} {showCountWeek > 2 ? "weeks" : "week"}
              </div>
              <CustomDatePicker
                title="End date"
                selected={moment(project.endDate).toDate()}
                onChange={handleChangeDate("endDate")}
              />
            </div>
            <Button onClick={sendDate} style={margin}>
              Send
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default graphql(updateProject, { name: "updateProject" })(
  UnassignedProjects
)
