import React from "react"
import { MDBRow, MDBCol } from "mdbreact"

import { Formik, Form, Field } from "formik"
import { Button } from "mdbreact"
import { ReactstrapInput } from "reactstrap-formik"
import { CustomMDBValue } from "../../CustomMDB"
import CustomDatePicker from "../../DatePicker"

import Selects from "./selects"

import { ProjectSchema } from "./validation"
import { timeInterval } from "../../../utils"

const CreateProjectForm = props => {
  const showCountWeek =
    timeInterval(props.endDate, props.startDate, "day", true) / 5
  return (
    <Formik
      initialValues={{
        name: "",
        value: "",
        number: ""
      }}
      validationSchema={ProjectSchema}
      onSubmit={props.handleCreateProject}
    >
      {() => (
        <Form>
          <MDBRow>
            <MDBCol md="6">
              <Field
                name="name"
                type="text"
                component={ReactstrapInput}
                label="Name"
              />
              <Field
                name="value"
                type="number"
                min="0.00"
                step="0.01"
                component={CustomMDBValue}
              />
            </MDBCol>
            <MDBCol md="6">
              <Field
                name="number"
                type="text"
                component={ReactstrapInput}
                label="Number"
              />
              <div className="flex position-relative form-group">
                <CustomDatePicker
                  title="Start date"
                  selected={props.startDate}
                  onChange={props.handleStartDateChange}
                />
                <div className="center">
                  {showCountWeek} {showCountWeek > 2 ? "weeks" : "week"}
                </div>
                <CustomDatePicker
                  title="End date"
                  selected={props.endDate}
                  onChange={props.handleEndDateChange}
                />
              </div>
            </MDBCol>
            <Selects />
          </MDBRow>
          <Button color="primary" type="submit" style={{ margin: 0 }}>
            Save
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default CreateProjectForm
