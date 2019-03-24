import React, { useState } from "react";

import { MDBListGroup, MDBListGroupItem } from "mdbreact";
import IosAddCircleOutline from "react-ionicons/lib/IosAddCircleOutline";
import IosRemoveCircleOutline from "react-ionicons/lib/IosRemoveCircleOutline";
import NumberFormat from "react-number-format";
import Collapse from "@kunukn/react-collapse";

const NA = ({ title }) => (
  <MDBListGroupItem>
    <strong>{title}:</strong> N/A
  </MDBListGroupItem>
);

const Address = props =>
  props.address ? (
    <MDBListGroupItem>
      <strong>Address:</strong> {props.address.line1}
    </MDBListGroupItem>
  ) : (
    <NA title="Address" />
  );

const ProjectNumber = props => (
  <MDBListGroupItem>
    <strong>Project Number:</strong>{" "}
    {props.number.slice(3, props.number.length)}
  </MDBListGroupItem>
);

const Value = props => (
  <MDBListGroupItem>
    <strong>Value:</strong>
    <NumberFormat
      value={props.value}
      thousandSeparator={true}
      displayType={"text"}
      renderText={value => <span> ${value}</span>}
    />
  </MDBListGroupItem>
);

const ProjectManager = ({ manager, collapse, handleSwitch }) => (
  <MDBListGroupItem>
    <strong>Project Manager:</strong>
    {manager && ` ${manager.firstName} ${manager.lastName} `}
    {!collapse ? (
      <IosAddCircleOutline onClick={() => handleSwitch(!collapse)} />
    ) : (
      <IosRemoveCircleOutline onClick={() => handleSwitch(!collapse)} />
    )}
    <Collapse
      isOpen={collapse}
      transition="height 400ms cubic-bezier(.4, 0, .2, 1)"
      render={() => (
        <div>
          <div>email: {manager.email || "N/A"}</div>
          <div>phone: {manager.phone || "N/A"}</div>
        </div>
      )}
    />
  </MDBListGroupItem>
);

const AssistantManager = props =>
  props.assistantManager ? (
    <MDBListGroupItem>
      <strong>Assistant Manager:</strong>
      {` ${props.assistantManager.firstName} ${props.assistantManager.lastName}`}
    </MDBListGroupItem>
  ) : (
    <NA title="Assistant Manager" />
  );

const Superintendent = ({
  superintendent,
  handleClickIntendent,
  collapseIntendent
}) => (
  <MDBListGroupItem>
    <strong>Superintendent:</strong>
    {superintendent ? (
      superintendent.company ? (
        <span>
          <span className="company-name">{` ${superintendent.company.name}`}</span> -{" "}
          {`${superintendent.firstName} ${superintendent.lastName}`}
        </span>
      ) : (
        <span>
          {` ${superintendent.firstName} ${superintendent.lastName} `}
          {!collapseIntendent ? (
            <IosAddCircleOutline
              onClick={() => handleClickIntendent(!collapseIntendent)}
            />
          ) : (
            <IosRemoveCircleOutline
              onClick={() => handleClickIntendent(!collapseIntendent)}
            />
          )}
          <Collapse
            isOpen={collapseIntendent}
            transition="height 400ms cubic-bezier(.4, 0, .2, 1)"
            render={() => (
              <div>
                <div>email: {superintendent.email || "N/A"}</div>
                <div>phone: {superintendent.phone || "N/A"}</div>
              </div>
            )}
          />
        </span>
      )
    ) : (
      <NA title="Superintendent" />
    )}
  </MDBListGroupItem>
);

const Mep = props =>
  props.mep ? (
    <MDBListGroupItem>
      <strong>MEP:</strong>
      {` ${props.mep.firstName} ${props.mep.lastName}`}
    </MDBListGroupItem>
  ) : (
    <NA title="MEP" />
  );

const ConstructionManager = props =>
  props.constructionManager ? (
    <MDBListGroupItem>
      <strong>Construction Manager:</strong>
      {` ${props.constructionManager.firstName} ${props.constructionManager.lastName}`}
    </MDBListGroupItem>
  ) : (
    <NA title="Construction Manager" />
  );

const Architect = props =>
  props.architect ? (
    <MDBListGroupItem>
      <strong>Architect:</strong>
      {` ${props.architect.firstName} ${props.architect.lastName}`}
    </MDBListGroupItem>
  ) : (
    <NA title="Architect" />
  );

const Properties = props => {
  const [collapse, handleSwitch] = useState(false);
  const [collapseIntendent, handleClickIntendent] = useState(false);
  return (
    <div style={{ margin: "10px" }}>
      <MDBListGroup>
        <Address {...props} />
        <ProjectNumber {...props} />
        <Value {...props} />
        <ProjectManager
          manager={props.manager}
          collapse={collapse}
          handleSwitch={handleSwitch}
        />
        <AssistantManager {...props} />
        <Superintendent
          superintendent={props.superintendent}
          collapseIntendent={collapseIntendent}
          handleClickIntendent={handleClickIntendent}
        />
        <Mep {...props} />
        <ConstructionManager {...props} />
        <Architect {...props} />
      </MDBListGroup>
    </div>
  );
};

export default Properties;
