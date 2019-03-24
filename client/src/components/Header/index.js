import React from "react"

const Header = props => (
  <div
    className="navbar navbar-light navbar-expand-md scrolling-navbar navbar"
    style={{ backgroundColor: "#4285f4", color: "#fff" }}
  >
    <h3>{props.title}</h3>
  </div>
)

export default Header
