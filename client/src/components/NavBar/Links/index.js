import React from "react";

import Item from "./item";

import * as path from "../../../constants/routes";

const items = [
  {
    id: 1,
    path: path.DASHBOARD,
    title: "Home"
  },
  {
    id: 2,
    path: path.PROFILE,
    title: "Profile"
  },
  {
    id: 3,
    path: path.SCHEDULE,
    title: "Schedule"
  },
  {
    id: 4,
    path: path.PROJECTS,
    title: "Projects"
  },
  {
    id: 5,
    path: path.CONTACTS,
    title: "Contacts"
  },
  {
    id: 6,
    path: path.CREATE_PROJECT,
    title: "Create new project"
  }
];

const Links = () => items.map(item => <Item key={item.id} {...item} />);

export default Links;
