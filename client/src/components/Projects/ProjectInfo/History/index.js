import React from "react"

import Timeline from "react-time-line"

const ProjectHistory = props => {
  const history = props.history.map(event => ({
    ts: event[0],
    text: event[1]
  }))
  return (
    <div className="archive">
      {history.length ? (
        <Timeline items={history} />
      ) : (
        "Project was not changed yet"
      )}
    </div>
  )
}

export default ProjectHistory
