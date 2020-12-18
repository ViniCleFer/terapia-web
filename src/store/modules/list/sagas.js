import { all, takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";

import history from "../../../services/history";
import baseUrl from "../../../services/baseUrl";

import { setProfileById } from "./actions";

export function* getProfileById({ payload }) {
  console.tron.log(payload);
  try {
    const response = yield call(
      axios.get,
      `${baseUrl.TERAPIA_BELLA}/profile/${payload.userId}`
    );

    if (response.status === 200) {
      yield put(setProfileById(response.data));
      history.push('/add-contacts');
    }
  } catch (err) {}
}

export default all([
  takeLatest("@lists/GET_PROFILE_BY_ID", getProfileById),
]);
