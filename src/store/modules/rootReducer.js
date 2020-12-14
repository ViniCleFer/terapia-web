import { combineReducers } from "redux";

import auth from "./auth/reducer";
import company from "./company/reducer";
import list from "./list/reducer";
import specialty from "./specialty/reducer";
import commons from "./commons/reducer";
import professionals from "./professionals/reducer";

// import user from './user/reducer';

export default combineReducers({
  auth,
  company,
  list,
  specialty,
  commons,
  professionals,
});
