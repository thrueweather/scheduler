import React, { Fragment } from "react";
import { compose, graphql } from "react-apollo";
import Timeline, {
  defaultSubHeaderLabelFormats
} from "react-calendar-timeline";
import moment from "moment";

import ScheduleHeader from "./Header";
import {
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBIcon,
  MDBBtn
} from "mdbreact";
import Loader from "../Loader";
import Legend from "./Legend";

import * as query from "../../queries";
import { groups, projects, unassignedProjects } from "../../utils";

import "../Projects/ProjectTable/TableHeader/style.css";

const ScheduleComponent = ({
  getSuperintendents,
  getProjects,
  visibleTime,
  defaultSubHeader,
  timeSteps,
  itemRenderer,
  handleChangeScale,
  modifiedProject,
  role,
  undoLastProjectChange,
  onItemMove
}) => {
  const usSubHeaderLabelFormats = {
    ...defaultSubHeaderLabelFormats,
    ...defaultSubHeader,
    modifiedProject,
    undoLastProjectChange
  };
  const supers = groups(getSuperintendents);
  const items = projects(getProjects);
  const unassigned = unassignedProjects(getProjects);
  return (
    <Fragment>
      <ScheduleHeader>
        <div style={{ display: "flex", alignItems: "center" }}>
          {role === "ADMIN" && (
            <MDBBtn
              color="primary"
              disabled={modifiedProject === null}
              onClick={undoLastProjectChange}
            >
              <MDBIcon icon="undo" />
            </MDBBtn>
          )}
          <MDBDropdown onClick={handleChangeScale}>
            <MDBDropdownToggle caret color="primary" style={{ margin: 0 }}>
              {visibleTime}
            </MDBDropdownToggle>
            <MDBDropdownMenu basic>
              <MDBDropdownItem>Days</MDBDropdownItem>
              <MDBDropdownItem>Weeks</MDBDropdownItem>
              <MDBDropdownItem>Months</MDBDropdownItem>
              <MDBDropdownItem>Years</MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </div>
      </ScheduleHeader>
      {supers ? (
        items ? (
          <Timeline
            groups={supers}
            items={items}
            sidebarContent={
              <div style={{ width: 129, padding: "10px" }}>Superintendent</div>
            }
            itemsSorted
            itemTouchSendsClick={false}
            stickyHeader={false}
            stackItems
            itemHeightRatio={0.9}
            showCursorLine
            canMove={true}
            canResize={false}
            subHeaderLabelFormats={usSubHeaderLabelFormats}
            timeSteps={timeSteps}
            defaultTimeStart={moment().add(-5, visibleTime)}
            defaultTimeEnd={moment().add(5, visibleTime)}
            itemRenderer={itemRenderer}
            onItemMove={onItemMove}
          />
        ) : (
          <Loader />
        )
      ) : (
        <Loader />
      )}
      <Legend unassignedProjects={unassigned} />
    </Fragment>
  );
};

export default compose(
  graphql(query.getPersons, {
    name: "getSuperintendents",
    options: { variables: { role: "SUPERINTENDENT", skip: false } }
  }),
  graphql(query.projects, { name: "getProjects" })
)(ScheduleComponent);
