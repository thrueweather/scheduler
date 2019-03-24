import React from "react"
import { graphql } from "react-apollo"
import moment from "moment"
import { Query } from "react-apollo"
import Stepper from "react-stepper-horizontal"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"

import Modal from "../../Modal"
import { Formik, Form, Field } from "formik"
import { Button } from "mdbreact"
import CustomDatePicker from "../../DatePicker"
import Properties from "./Properties"
import History from "./History"

import * as query from "../../../queries"
import { timeInterval } from "../../../utils"
import { steps } from "../../../utils/api"

const ProjectInfo = ({
  active,
  value,
  project,
  handleClickModal,
  handleChangeValue,
  handleUpdateProject,
  handleChangeDate,
  getSuperintendents
}) => {
  const showCountWeek =
    timeInterval(project.endDate, project.startDate, "day", true) / 5
  return (
    <Modal isActive={active} closeModal={handleClickModal} title="Edit project">
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChangeValue}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Edit" />
          <Tab label="Project Info" />
          <Tab label="History" />
        </Tabs>
      </AppBar>
      {active && value === 0 && (
        <Formik
          initialValues={{
            id: project.id,
            title: project.name,
            superintendentId:
              project.superintendent !== null ? project.superintendent.id : 0,
            managerId: project.manager && project.manager.id,
            calculateId: true
          }}
          onSubmit={handleUpdateProject}
        >
          {() => (
            <div className="card">
              <div className="card-body">
                <Form>
                  <div className="center">
                    <h3>{project.name}</h3>
                  </div>
                  <label>Superintendent</label>
                  <Field
                    id="superintendentId"
                    name="superintendentId"
                    className="browser-default custom-select position-relative form-group"
                    component="select"
                  >
                    {project.superintendent && (
                      <option
                        name="superintendentId"
                        id="superintendentId"
                        value={project.superintendent}
                      >
                        {project.superintendent.firstName}
                        {project.superintendent.lastName}
                      </option>
                    )}
                    {!project.superintendent && (
                      <option
                        name="superintendentId"
                        key={0}
                        value={0}
                        id="superintendentId"
                      >
                        UNASSIGNED
                      </option>
                    )}
                    {project.superintendent && getSuperintendents.persons
                      ? getSuperintendents.persons.map(i => {
                          return (
                            i.id !== project.superintendent.id && (
                              <option
                                id="superintendentId"
                                key={i.id}
                                name="superintendentId"
                                value={i.id}
                              >
                                {i.firstName} {i.lastName}
                              </option>
                            )
                          )
                        })
                      : getSuperintendents.persons &&
                        getSuperintendents.persons.map(i => (
                          <option
                            id="superintendentId"
                            key={i.id}
                            name="superintendentId"
                            value={i.id}
                          >
                            {i.firstName} {i.lastName}
                          </option>
                        ))}
                    {project.superintendent && (
                      <option
                        name="superintendentId"
                        key={0}
                        value={0}
                        id="superintendentId"
                      >
                        UNASSIGNED
                      </option>
                    )}
                  </Field>
                  <label>Manager</label>
                  <Query
                    query={query.getUsers}
                    variables={{ role: "PROJECT_MANAGER", skip: false }}
                  >
                    {({ loading, error, data }) => {
                      if (loading) return <p>Loading...</p>
                      if (error) return <p>{`Error! ${error.message}`}</p>
                      return (
                        <Field
                          id="managerId"
                          name="managerId"
                          className="browser-default custom-select position-relative form-group"
                          component="select"
                        >
                          <option
                            name="managerId"
                            id="managerId"
                            value={project.manager.id}
                          >
                            {project.manager.firstName}{" "}
                            {project.manager.lastName}
                          </option>
                          {data.users.map(
                            i =>
                              i.id !== project.manager.id && (
                                <option
                                  id="managerId"
                                  key={i.id}
                                  value={i.id}
                                  name="managerId"
                                >
                                  {i.firstName} {i.lastName}
                                </option>
                              )
                          )}
                        </Field>
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
                  <Stepper steps={steps} activeStep={parseInt(project.phase)} />
                  <Button type="submit" style={{ margin: "10px 0 0 0" }}>
                    Save
                  </Button>
                </Form>
              </div>
            </div>
          )}
        </Formik>
      )}
      {value === 1 && <Properties {...project} />}
      {value === 2 && <History {...project} />}
    </Modal>
  )
}

export default graphql(query.getPersons, {
  name: "getSuperintendents",
  options: { variables: { role: "SUPERINTENDENT", skip: false } }
})(ProjectInfo)
