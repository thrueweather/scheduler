import React, { useState, useCallback, useEffect } from "react";
import { graphql } from "react-apollo";

import {
  Navbar,
  NavbarBrand,
  MDBNavbarToggler,
  MDBNavItem,
  MDBCollapse,
  MDBNavbarNav,
  NavbarNav,
  Collapse
} from "mdbreact";

import Links from "./Links";
import NewProjects from "./NewProjects";
import ModifiedProjects from "./ModifiedProjects";

import { me } from "../../queries";
import * as path from "../../constants/routes";
import { BACKEND_URL } from "../../constants";

const NavBar = ({ user }) => {
  const [collapse, handleClick] = useState("");
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const toggleCollapse = useCallback(collapseID => () =>
    handleClick((!collapse && collapseID) || "")
  );

  const handleLogout = () => localStorage.removeItem("token");

  const role = user.me && user.me.role;

  return (
    <Navbar className="flexible-navbar navbar" light expand="md" scrolling>
      <NavbarBrand href={path.HOME}>Rehmora</NavbarBrand>
      <MDBNavbarToggler onClick={toggleCollapse("navbarCollapse13")} />
      <MDBCollapse id="navbarCollapse13" isOpen={collapse} navbar>
        <MDBNavbarNav left>
          <Links />
          {width <= 768 ? (
            <React.Fragment>
              <li className="nav-item">
                <a
                  className="nav-link Ripple-parent"
                  href={`${BACKEND_URL}/admin`}
                >
                  Admin Login
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/login" onClick={handleLogout}>
                  Logout
                </a>
              </li>
            </React.Fragment>
          ) : (
            ""
          )}
          {role === "ADMIN" && <NewProjects />}
        </MDBNavbarNav>
      </MDBCollapse>
      <Collapse navbar>
        <NavbarNav right>
          <MDBNavItem>
            <a href={`${BACKEND_URL}/admin`}>Admin Login </a>
          </MDBNavItem>
          <MDBNavItem style={{ marginLeft: "10px" }} onClick={handleLogout}>
            <a href="/login">Logout</a>
          </MDBNavItem>
        </NavbarNav>
        {role === "ADMIN" && <ModifiedProjects />}
      </Collapse>
    </Navbar>
  );
};

export default graphql(me, { name: "user" })(NavBar);
