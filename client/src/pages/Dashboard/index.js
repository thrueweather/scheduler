import React, { Fragment } from "react"

import GetProjects from "../../components/Statistics/GetProjects"
import GetUsers from "../../components/Statistics/GetUsers"
import Header from "../../components/Header"

import { withAuth } from '../../hocs/PrivateRoute'

const Main = () => (
  <Fragment>
    <Header title="Statistic" />
    <div className="p-5">
      <GetUsers />
      <GetProjects />
    </div>
  </Fragment>
)

export default withAuth(Main)
