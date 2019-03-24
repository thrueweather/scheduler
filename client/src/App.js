import React, { lazy, Suspense } from "react"
import { Switch, Route } from "react-router"

import * as path from "./constants/routes"

import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import Main from "./components/Main"
import Loader from "./components/Loader"

const Dashboard = lazy(() => import("./pages/Dashboard"))
const Projects = lazy(() => import("./pages/Dashboard/Projects"))
const ApproveChanges = lazy(() => import("./pages/Dashboard/ApproveChanges"))
const ApproveCreation = lazy(() => import("./pages/Dashboard/ApproveCreation"))
const Contacts = lazy(() => import("./pages/Dashboard/Contacts"))
const Schedule = lazy(() => import("./pages/Dashboard/Schedule"))
const CreateProject = lazy(() => import("./pages/Dashboard/CreateProject"))
const Profile = lazy(() => import("./pages/Dashboard/Profile"))
const ConfirmEmail = lazy(() => import("./pages/ConfirmEmail"))
const ResetPassword = lazy(() => import("./pages/ResetPassword"))
const PageNotFound = lazy(() => import("./components/PageNotFound"))

export default () => (
  <Switch>
    <Route exact path={path.SIGN_UP} component={SignUp} />
    <Route exact path={path.SIGN_IN} component={Login} />
    <Main>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route exact path={path.DASHBOARD} render={props => <Dashboard {...props} />}/>
          <Route exact path={path.PROJECTS} render={props => <Projects {...props} />}/>
          <Route exact path={path.APPROVE_CHANGES} render={props => <ApproveChanges {...props} />}/>
          <Route exact path={path.APPROVE_CREATION} render={props => <ApproveCreation {...props} />}/>
          <Route exact path={path.CONTACTS} render={props => <Contacts {...props} />}/>
          <Route exact path={path.SCHEDULE} render={props => <Schedule {...props} />}/>
          <Route exact path={path.CREATE_PROJECT} render={props => <CreateProject {...props} />}/>
          <Route exact path={path.PROFILE} render={props => <Profile {...props} />}/>
          <Route exact path={path.CONFIRM_EMAIL} render={props => <ConfirmEmail {...props} />}/>
          <Route exact path={path.RESET_PASSWORD} render={props => <ResetPassword {...props} />}/>
          <Route exact render={props => <PageNotFound {...props} />} />
        </Switch>
      </Suspense>
    </Main>
  </Switch>
)

