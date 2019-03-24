import React from "react"

import UnassignedProjects from "./UnassignedProjects"
import Managers from "./Managers"

const Legend = ({ unassignedProjects }) => (
  <div className="flex-start">
    <UnassignedProjects unassignedProjects={unassignedProjects} />
    <Managers />
  </div>
)

export default Legend
