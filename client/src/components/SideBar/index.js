import React from "react"
import { Link } from "react-router-dom"

import * as path from "../../constants/routes"

import { ListGroup, MDBBtn } from "mdbreact"

import logo from "../../assets/logo.svg"

const Sidebar = () => (
  <div className="sidebar-fixed position-fixed center">
    <a href={path.HOME} className="logo-wrapper waves-effect">
      <img alt="MDB React Logo" className="img-fluid" src={logo} />
      <h1>Rehmora</h1>
    </a>
    <ListGroup className="list-group-flush">
      <Link to={path.PROJECTS}>Projects</Link>
      <Link to={path.CREATE_PROJECT}>
        <MDBBtn color="primary">Create New Project</MDBBtn>
      </Link>
    </ListGroup>
  </div>
)

export default Sidebar
