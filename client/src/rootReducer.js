import { combineReducers } from "redux";

import auth from "./reducers/auth";
import schedule from './reducers/shcedule';

export default combineReducers({
  auth,
  schedule
});
