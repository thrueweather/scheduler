import React from "react"
import moment from "moment"
import { Query } from "react-apollo"
import Stepper from "react-stepper-horizontal"

import { Formik, Form } from "formik"
import { Button } from "mdbreact"
import CustomDatePicker from "../../DatePicker"

import { getUsers, getPersons } from "../../../queries"
import { timeInterval } from "../../../utils"
import { steps } from "../../../utils/api"

const EditProjectForm = props => {
  const showCountWeek =
    timeInterval(props.endDate, props.startDate, "day", true) / 5
  return (
    <div className="card">
      <div className="card-body">
        <Formik
          initialValues={{
            id: props.id,
            title: props.name,
            superintendentId: props.superintendent.id,
            calculateId: true
          }}
          onSubmit={props.updateProject}
        >
          {() => (
            <Form>
              <div className="center">
                <h3>{props.name}</h3>
              </div>
              <label>Superintendent</label>
              <select
                id="superintendentId"
                name="superintendentId"
                className="browser-default custom-select position-relative form-group"
              >
                <option
                  name="superintendentId"
                  id="superintendentId"
                  value={props.superintendent.id}
                >
                  {props.superintendent.firstName}
                </option>
                <Query
                  query={getPersons}
                  variables={{ role: "SUPERINTENDENT", skip: false }}
                >
                  {({ loading, error, data }) => {
                    if (loading || !data.persons) return "Loading..."
                    if (error) return `Error! ${error.message}`
                    return data.persons.map(
                      i =>
                        i.id !== props.superintendent.id && (
                          <option
                            key={i.id}
                            name="superintendentId"
                            value={i.id}
                            id="superintendentId"
                          >
                            {i.firstName} {i.lastName}
                          </option>
                        )
                    )
                  }}
                </Query>
                <option
                  name="superintendentId"
                  key={0}
                  value={0}
                  id="superintendentId"
                >
                  UNASSIGNED
                </option>
              </select>
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
                      <option
                        name="managerId"
                        id="managerId"
                        value={props.manager.id}
                      >
                        {props.manager.firstName}
                      </option>
                      {data.users.map(
                        i =>
                          i.id !== props.manager.id && (
                            <option
                              key={i.id}
                              name="managerId"
                              value={i.id}
                              id="managerId"
                            >
                              {i.firstName} {i.lastName}
                            </option>
                          )
                      )}
                    </select>
                  )
                }}
              </Query>
              <div className="flex position-relative form-group">
                <CustomDatePicker
                  title="Start date"
                  selected={moment(props.startDate).toDate()}
                  onChange={props.handleChangeDate("startDate")}
                />
                <div className="center">
                  {showCountWeek} {showCountWeek > 2 ? "weeks" : "week"}
                </div>
                <CustomDatePicker
                  title="End date"
                  selected={moment(props.endDate).toDate()}
                  onChange={props.handleChangeDate("endDate")}
                />
              </div>
              <Stepper steps={steps} activeStep={parseInt(props.phase)} />
              <Button type="submit" style={{ margin: "10px 0 0 0" }}>
                Save
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default EditProjectForm
