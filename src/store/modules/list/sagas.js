import { all, takeLatest, call, put } from "redux-saga/effects";
// import { toast } from "react-toastify";
// import qs from "qs-stringify";
import axios from "axios";
import history from "../../../services/history";
import {
  setUsersByHighRisk,
  setUsersWithoutMonitoring,
  setHistoryCalls,
  setProfileById,
} from "./actions";
// import { getCompanyInfo } from "../company/actions";
import baseUrl from "../../../services/baseUrl";

export function* getUsersHighRisk({ payload }) {
  try {
    const response = yield call(axios.get, `${baseUrl.BELLA}/profile/highRisk`);

    yield put(setUsersByHighRisk(response.data));
    console.tron.log(response);
  } catch (error) {
    // toast.error("Falha no cadastro, verifique seus dados");
    // yield put(signFailure());
  }
}

// export function setToken({ payload }) {
//   if (!payload) return;

//   const { token } = payload.auth;

//   if (token) {
//     api.defaults.headers.Authorization = `Bearer ${token}`;
//   }
// }

export function* getUsersWithoutMonitoring() {
  try {
    const response = yield call(
      axios.get,
      `${baseUrl.BELLA}/profile/pendingMonitoring`
    );

    yield put(setUsersWithoutMonitoring(response.data));
    console.tron.log(response);
  } catch (err) {}
}

export function* getHistoryCalls({ payload }) {
  console.tron.log(payload);
  try {
    const response = yield call(
      axios.get,
      `${baseUrl.BELLA}/history/${payload.userId}`
    );

    if (response.status === 200) {
      console.tron.log(response, payload);
      yield put(setHistoryCalls(response.data));
    }
  } catch (err) {}
}

export function* getProfileById({ payload }) {
  console.tron.log(payload);
  try {
    const response = yield call(
      axios.get,
      `${baseUrl.BELLA}/profile/${payload.userId}`
    );

    if (response.status === 200) {
      console.tron.log(response, payload);
      yield put(setProfileById(response.data));
    }
  } catch (err) {}
}

export function signOut() {
  history.push("/");
}

export default all([
  takeLatest("@lists/GET_USERS_HIGH_RISK", getUsersHighRisk),
  takeLatest("@lists/GET_USERS_WITHOUT_MONITORING", getUsersWithoutMonitoring),
  takeLatest("@lists/GET_HISTORY_CALLS", getHistoryCalls),
  takeLatest("@lists/GET_PROFILE_BY_ID", getProfileById),
]);
