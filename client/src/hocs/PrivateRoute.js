import React from "react"
import { graphql, compose } from "react-apollo"
import { connect } from "react-redux"
import { withRouter } from "react-router"

import { verifyToken, me } from "../queries"
import { logout } from "../actions"

export const withAuth = WrappedComponent => {
  class PrivateRoute extends React.Component {
    async componentWillMount() {
        try {
          const token = await JSON.parse(window.localStorage.getItem("token")).token
          await this.props.authorization({
            variables: {
              token: token,
            }
          })
        } catch (error) {
          this.props.isLogout()
          return this.props.history.push("/login")
        }
    }
    render() {
      const role = this.props.user.me && this.props.user.me.role 
      return <WrappedComponent {...this.props} role={role}  />
    }
  }
  return compose(
    graphql(verifyToken, {name: "authorization"}),
    graphql(me, {name: 'user'}),
    connect(null,{isLogout: logout})
  )(withRouter(PrivateRoute))
}