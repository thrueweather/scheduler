import React, { useState, useCallback, Fragment } from "react";
import { graphql } from "react-apollo";
import moment from "moment";
import swal from "sweetalert";
import { MDBCard, MDBCardBody } from "mdbreact";

import CreateProjectForm from "../../../components/Forms/CreateProjectForm";
import Header from "../../../components/Header";

import { createProject, projects, getPersons, pendingCreationProjects } from "../../../queries";
import { withAuth } from "../../../hocs/PrivateRoute";
import * as path from "../../../constants/routes";

const CreateProject = props => {
  const [startDate, changeStartDate] = useState(moment().toDate());
  const [endDate, changeEndDate] = useState(moment().toDate());

  const handleCreateProject = async values => {
    const superintendentId = document.getElementById("superintendentId").value;
    const managerId = document.getElementById("managerId").value;
    const { name, value, number } = values;
    try {
      await props
        .createProject({
          variables: {
            name: name,
            value: parseFloat(`${value}`.replace(/,/g, "")),
            number: number,
            superintendentId: superintendentId,
            managerId: managerId,
            projectId: 123,
            startDate: moment(startDate).toDate(),
            endDate: moment(endDate).toDate(),
            unassigned: false
          },
          refetchQueries: [
            {
              query: getPersons,
              variables: { role: "SUPERINTENDENT", skip: false }
            },
            { query: projects },
            { query: pendingCreationProjects }
          ]
        })
        .then(response => {
          if (response.data.createProject.superintendentHasProject === "true") {
            swal({
              title: "Superintendent already has project in this time!",
              text:
                "Do you want to change superintendent for your new project?",
              icon: "warning",
              buttons: ["Yes, I want", "No, create without superintendent"],
              dangerMode: true
            }).then(willContinue => {
              if (willContinue) {
                props
                  .createProject({
                    variables: {
                      name: name,
                      value: parseFloat(`${value}`.replace(/,/g, "")),
                      number: number,
                      managerId: managerId,
                      projectId: 123,
                      startDate: moment(startDate).toDate(),
                      endDate: moment(endDate).toDate(),
                      unassigned: true
                    },
                    refetchQueries: [
                      {
                        query: getPersons,
                        variables: { role: "SUPERINTENDENT", skip: false }
                      },
                      { query: projects }
                    ]
                  })
                  .then(() => {
                    swal({
                      text: "Project added to unassigned query",
                      icon: "success"
                    }).then(() => props.history.push(path.SCHEDULE), "x");
                  });
              }
            });
          } else if (props.role === "PROJECT_MANAGER") {
            swal({
              text: "Project has been added on review",
              icon: "success"
            }).then(() => props.history.push(path.SCHEDULE), "x");
          } else {
            props.history.push(path.SCHEDULE);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartDateChange = useCallback(startDate =>
    changeStartDate(startDate)
  );

  const handleEndDateChange = useCallback(endDate => changeEndDate(endDate));

  return (
    <Fragment>
      <Header title="Create project" />
        <div className="p-5 p-4">
          <MDBCard>
            <MDBCardBody>
              <CreateProjectForm
                handleCreateProject={handleCreateProject}
                startDate={startDate}
                endDate={endDate}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
              />
            </MDBCardBody>
          </MDBCard>
        </div>
    </Fragment>
  );
};

export default graphql(createProject, { name: "createProject" })(
  withAuth(CreateProject)
);
