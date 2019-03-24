import React from "react"
import { Formik, Form, Field } from "formik"
import { MDBCol, MDBBtn } from "mdbreact"
import { SignupSchema } from "./validation"
import { CustomMDBInput } from "../../CustomMDB"

export const SignUpForm = props => (
  <MDBCol
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}
  >
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password1: "",
        password2: ""
      }}
      validationSchema={SignupSchema}
      onSubmit={props.register}
    >
      {() => (
        <div className="card" style={{ width: "50%" }}>
          <div className="card-header">Signup</div>
          <div className="card-body">
            <Form>
              <Field
                name="firstName"
                type="text"
                component={CustomMDBInput}
                label="First name"
              />
              <Field
                name="lastName"
                type="text"
                component={CustomMDBInput}
                label="Last name"
              />
              <Field
                name="email"
                type="email"
                component={CustomMDBInput}
                label="Email"
              />
              <Field
                name="password1"
                type="password"
                component={CustomMDBInput}
                label="Password"
              />
              <Field
                name="password2"
                type="password"
                component={CustomMDBInput}
                label="Password confirmation"
              />
              <MDBBtn
                type="submit"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "15px auto 15px auto"
                }}
              >
                Sign Up
              </MDBBtn>
            </Form>
          </div>
        </div>
      )}
    </Formik>
  </MDBCol>
)
