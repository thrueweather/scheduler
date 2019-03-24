import React from "react"

import { MDBIcon } from "mdbreact"

const Manager = ({ manager }) => (
  <tr>
    <td>{manager.id}</td>
    <td>{manager.firstName}</td>
    <td>
      <MDBIcon icon="circle" style={{ color: manager.color }} />
    </td>
  </tr>
)

export default Manager
