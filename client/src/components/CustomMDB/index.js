import React from "react"
import { MDBInput } from "mdbreact"
import NumberFormat from "react-number-format"

const Error = ({ form, field }) =>
  form.errors && (
    <div className="invalid-feedback">{form.errors[field.name]}</div>
  )

export const CustomMDBValue = props => (
  <div>
    <label>Value</label>
    <NumberFormat
      {...props.field}
      className="form-control"
      thousandSeparator={true}
    />
    <Error {...props} />
  </div>
)

export const CustomMDBEmailInput = props => (
  <div>
    <MDBInput {...props.field} icon="user" />
    <Error {...props} />
  </div>
)

export const CustomMDBPasswordInput = props => (
  <div>
    <MDBInput {...props.field} type={props.type} icon="key" />
    <Error {...props} />
  </div>
)

export const CustomMDBInput = props => (
  <div>
    <MDBInput {...props.field} type={props.type} label={props.label} />
    <Error {...props} />
  </div>
)
