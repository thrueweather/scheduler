import React from "react";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";

import {
  MDBNavItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem
} from "mdbreact";

import { pendingCreationProjects } from "../../../queries";

const NewProjects = () => (
  <MDBNavItem>
    <MDBDropdown>
      <Query query={pendingCreationProjects}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return <p>{`Error! ${error.message}`}</p>;
          if (data && data.pendingCreationProjects.length) {
            return (
              <div>
                <MDBDropdownToggle nav>
                  New projects
                  <span className="badge badge-danger ml-2">
                    {data.pendingCreationProjects.length}
                  </span>
                </MDBDropdownToggle>
                <MDBDropdownMenu className="dropdown-default">
                  {data.pendingCreationProjects.map(project => {
                    const projectName = `${project.manager.firstName} ${
                      project.manager.lastName
                    } `;
                    return (
                      <MDBDropdownItem key={project.id}>
                        <Link to={`/dashboard/approve-creation/${project.id}`}>
                          {projectName} wants to create{" "}
                          <strong> {project.name}</strong>
                        </Link>
                      </MDBDropdownItem>
                    );
                  })}
                </MDBDropdownMenu>
              </div>
            );
          }
          return null;
        }}
      </Query>
    </MDBDropdown>
  </MDBNavItem>
);

export default NewProjects;
