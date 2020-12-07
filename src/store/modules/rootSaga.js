import { all } from "redux-saga/effects";

import auth from "./auth/sagas";
import company from "./company/sagas";
import list from "./list/sagas";
import specialty from "./specialty/sagas";

export default function* rootSaga() {
  return yield all([auth, company, list, specialty]);
}
