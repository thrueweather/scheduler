import React, { Component, Fragment } from "react"
import { graphql, compose } from "react-apollo"
import { connect } from "react-redux"

import moment from "moment"
import swal from "sweetalert"
import { MDBCard, MDBCardBody } from "mdbreact"

import ScheduleComponent from "../../../components/Schedule"
import Header from "../../../components/Header"
import Modal from "../../../components/Modal"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import EditProjectForm from "../../../components/Forms/EditProjectForm"
import Properties from "../../../components/Projects/ProjectInfo/Properties"
import Archive from "../../../components/Projects/ProjectInfo/History"

import * as query from "../../../queries";
import { changeShowTime } from "../../../actions";
import { groups } from "../../../utils";
import { projectColumns } from "../../../utils/api";
import { withAuth } from "../../../hocs/PrivateRoute";

import "./style.css"

class Schedule extends Component {
  constructor(props) {
    super(props)

    this.state = {
      item: {},
      startDate: null,
      endDate: null,
      visibleTime: props.visibleTime,
      defaultSubHeader: props.defaultSubHeader,
      timeSteps: props.timeSteps,
      editModal: false,
      modifiedProject: null,
      value: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visibleTime !== this.state.visibleTime) {
      window.location.reload()
    }
  }

  handleClickGetData = async item => {
    try {
      const project = await this.props.getProject.refetch({
        projectId: item.projectId,
        skip: false
      })
      await this.setState({ item: project.data.getProject })
      this.setState({ editModal: true })
    } catch (error) {}
  }

  itemRenderer = ({ item, itemContext, getItemProps, getResizeProps }) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
    const backgroundColor = itemContext.selected
      ? itemContext.dragging
        ? "red"
        : item.selectedBgColor
      : item.bgColor
    const borderColor = itemContext.resizing ? "red" : item.color
    return (
      <div
        {...getItemProps({
          style: {
            backgroundColor,
            color: item.color,
            borderColor,
            borderWidth: 1,
            borderRadius: 10,
            borderLeftWidth: itemContext.selected ? 3 : 1,
            borderRightWidth: itemContext.selected ? 3 : 1
          },
          onTouchStart: () => this.handleClickGetData(item),
          onDoubleClick: () => this.handleClickGetData(item)
        })}
      >
        {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}
        <div
          style={{
            height: itemContext.dimensions.height,
            overflow: "hidden",
            paddingLeft: 3,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {itemContext.title}
        </div>
        {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
      </div>
    )
  }

  updateProject = async data => {
    const managerId = document.getElementById("managerId").value
    const superintendentId = document.getElementById("superintendentId").value
    const { startDate, endDate } = this.state.item
    const response = await this.props.updateProject({
      variables: {
        projectId: data.id,
        managerId: managerId,
        superintendentId: superintendentId,
        startDate: startDate ? startDate : data.startDate,
        endDate: endDate ? endDate : data.endDate
      },
      refetchQueries: [
        {
          query: query.getPersons,
          variables: { role: "SUPERINTENDENT", skip: false }
        },
        { query: query.projects },
        { query: query.pendingChangesProjects }
      ]
    })
    if (response.data.updateProject.superintendentHasProject === "true") {
      swal({
        title:
          "Superintendent already has project in this time, choose another one!",
        icon: "warning",
        buttons: "Ok",
        dangerMode: true
      })
    } else {
      this.setState({
        editModal: false,
        modifiedProject: data.id
      })
    }
  }

  undoLastProjectChange = () => {
    this.props
      .undoLastProjectChange({
        variables: {
          projectId: this.state.modifiedProject,
          skip: false
        },
        refetchQueries: [
          {
            query: query.getPersons,
            variables: { role: "SUPERINTENDENT", skip: false }
          },
          { query: query.projects }
        ]
      })
      .then(response => {
        if (!response.data.undoLastProjectChange.errors.length) {
          this.setState({ modifiedProject: null })
        }
      })
  }

  handleItemMove = async (projectId, dragTime, newGroupOrder) => {
    const group = groups(this.props.getSuperintendents)[newGroupOrder];
    try {
      const project = await this.props.getProject.refetch({
        projectId,
        skip: false
      });
      const manager = project.data.getProject.manager.id;
      const start = moment(project.data.getProject.startDate);
      const end = moment(project.data.getProject.endDate);
      await this.props.updateProject({
        variables: {
          projectId: parseInt(projectId),
          managerId: manager,
          superintendentId: group.id,
          startDate: moment(dragTime),
          endDate: moment(dragTime + (end - start))
        },
        refetchQueries: [
          {
            query: query.getPersons,
            variables: { role: "SUPERINTENDENT", skip: false }
          },
          { query: query.projects }
        ]
      })
      this.setState({ editModal: false, modifiedProject: projectId })
    } catch (error) {}
  }

  handleChangeValue = (event, value) => this.setState({ value })

  handleChangeIndex = index => this.setState({ value: index })

  toggle = tab => () => {
    if (this.state.activeItem !== tab) {
      this.setState({
        activeItem: tab
      })
    }
  }

  handleChangeScale = e => {
    const type = e.target.textContent

    if (type.length <= 6) {
      this.props.changeScale(type)
    }
  }

  handleChangeDate = type => date => {
    this.setState(state => ({
      item: {
        ...state.item,
        [type]: moment(date)
      }
    }))
  }

  handleActiveModal = () => {
    this.setState({
      editModal: !this.state.editModal
    })
  }

  render() {
    const {
      item,
      editModal,
      visibleTime,
      defaultSubHeader,
      timeSteps,
      value
    } = this.state

    return (
      <Fragment>
        <Header title="Schedule" />
        <div className="d-flex justify-content-center pt-4 p-5">
          <MDBCard style={{ width: "90rem", height: "100%" }}>
            <MDBCardBody>
              <ScheduleComponent
                visibleTime={visibleTime}
                defaultSubHeader={defaultSubHeader}
                timeSteps={timeSteps}
                itemRenderer={this.itemRenderer}
                handleChangeScale={this.handleChangeScale}
                handleClickModal={this.handleActiveModal}
                columns={projectColumns}
                modifiedProject={this.state.modifiedProject}
                role={this.props.role}
                undoLastProjectChange={this.undoLastProjectChange}
                onItemMove={this.handleItemMove}
              />
              <Modal
                isActive={editModal}
                title="Project"
                closeModal={this.handleActiveModal}
              >
                <AppBar position="static" color="default">
                  <Tabs
                    value={value}
                    onChange={this.handleChangeValue}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="Edit" />
                    <Tab label="Project Info" />
                    <Tab label="History" />
                  </Tabs>
                </AppBar>
                {value === 0 && (
                  <EditProjectForm
                    handleChangeDate={this.handleChangeDate}
                    updateProject={this.updateProject}
                    {...item}
                  />
                )}
                {value === 1 && <Properties {...item} />}
                {value === 2 && <Archive {...item} />}
              </Modal>
            </MDBCardBody>
          </MDBCard>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  visibleTime: state.schedule.visibleTime,
  defaultSubHeader: state.schedule.defaultSubHeaderLabelFormats,
  timeSteps: state.schedule.timeSteps
})

export default compose(
  graphql(query.getProject, {
    name: "getProject",
    options: { variables: { skip: true } }
  }),
  graphql(query.projects, { name: "getProjects" }),
  graphql(query.getPersons, {
    name: "getSuperintendents",
    options: { variables: { role: "SUPERINTENDENT", skip: false } }
  }),
  graphql(query.updateProject, { name: "updateProject" }),
  graphql(query.undoLastProjectChange, {
    name: "undoLastProjectChange",
    options: { variables: { skip: true } }
  }),
  connect(
    mapStateToProps,
    {
      changeScale: changeShowTime
    }
  )
)(withAuth(Schedule))
