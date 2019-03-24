import React from "react";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";

import {
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem
} from "mdbreact";

import IosNotifications from "react-ionicons/lib/IosNotifications";

import { pendingChangesProjects } from "../../../queries";

const ModifiedProjects = () => (
  <MDBDropdown>
    <Query query={pendingChangesProjects}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return <p>{`Error! ${error.message}`}</p>;
        if (data && data.pendingChangesProjects.length) {
          return (
            <React.Fragment>
              <MDBDropdownToggle nav>
                <div className="notificat">
                  <IosNotifications fontSize="30px" color="#2196f3" />
                  <span>{data.pendingChangesProjects.length}</span>
                </div>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="dropdown-default" right>
                {data.pendingChangesProjects.map(project => {
                  const projectName = `${project.manager.firstName} ${
                    project.manager.lastName
                  } `;
                  return (
                    <MDBDropdownItem key={project.id}>
                      <Link to={`/dashboard/approve-changes/${project.id}`}>
                        {projectName} modified <strong> {project.name}</strong>
                      </Link>
                    </MDBDropdownItem>
                  );
                })}
              </MDBDropdownMenu>
            </React.Fragment>
          );
        }
        return null;
      }}
    </Query>
  </MDBDropdown>
);

export default ModifiedProjects;
