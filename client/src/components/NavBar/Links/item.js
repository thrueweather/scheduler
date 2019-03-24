import React from 'react';

import { MDBNavItem, MDBNavLink, } from "mdbreact"

const Item = ({ path, title }) => (
    <MDBNavItem>
        <MDBNavLink to={path}>{title}</MDBNavLink>
    </MDBNavItem>
)

export default Item