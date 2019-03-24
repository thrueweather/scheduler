import React from "react";
import { Query } from "react-apollo";

import { MDBCard } from "mdbreact";

import { projects } from "../../queries";

const GetProjects = () => (
  <Query query={projects} variables={{ role: "ALL" }}>
    {({ loading, error, data }) => {
      if (loading) return <div>Loading...</div>;
      if (error) return `Error! ${error.message}`;
      return (
        <MDBCard className="card-body data-count">
          <h3>Projects: {data.projects.length}</h3>
        </MDBCard>
      );
    }}
  </Query>
);

export default GetProjects
