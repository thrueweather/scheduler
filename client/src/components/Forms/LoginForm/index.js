import React from "react"

import { Link } from "react-router-dom"
import { Formik, Form, Field } from "formik"
import { MDBCol, MDBCard, MDBBtn } from "mdbreact"
import { CustomMDBEmailInput, CustomMDBPasswordInput } from "../../CustomMDB"

import * as path from "../../../constants/routes"
import { LoginSchema } from "./validation"

export const LoginForm = ({ login }) => (
  <MDBCol
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}
  >
    <MDBCard style={{ width: "22rem" }}>
      <Formik
        initialValues={{
          username: "",
          password: ""
        }}
        validationSchema={LoginSchema}
        onSubmit={login}
      >
        {() => (
          <div className="card">
            <div className="card-header">Login</div>
            <div className="card-body">
              <Form>
                <Field
                  name="username"
                  type="email"
                  component={CustomMDBEmailInput}
                  label="Email"
                />
                <Field
                  name="password"
                  type="password"
                  component={CustomMDBPasswordInput}
                  label="Password"
                />
                <div>
                  <MDBBtn
                    type="submit"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "15px auto 15px auto"
                    }}
                  >
                    Login
                  </MDBBtn>
                </div>
                <div className="center">
                  <span>Don't have account? </span>
                  <Link to={path.SIGN_UP} style={{ color: "blue" }}>
                    Sign up!
                  </Link>
                </div>
              </Form>
            </div>
          </div>
        )}
      </Formik>
    </MDBCard>
  </MDBCol>
)
