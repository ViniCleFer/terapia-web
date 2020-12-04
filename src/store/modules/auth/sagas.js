import { all, takeLatest, call, put } from "redux-saga/effects";
import { toast } from "react-toastify";
import qs from "qs-stringify";
import axios from "axios";
import history from "../../../services/history";
import { signInSuccess, signFailure, setSigned, saveProfile } from "./actions";
import { getCompanyInfo } from "../company/actions";
import baseUrl from "../../../services/baseUrl";

export function* signIn({ payload }) {
  console.log("paypay", payload);
  // yield spawn(codePushSaga);
  try {
    const data = {
      // grant_type: "password",
      // username: 'user1@teste.com',
      email: payload.email,
      password: payload.password,
    };

    const response = yield call(
      axios.post,
      `${baseUrl.AUTH}/user/login/web`,
      data
    );

    console.tron.log(response);

    const { access_token: token, refresh_token, userId } = response.data;

    axios.defaults.headers.Authorization = `Bearer ${token}`;

    if (response.status === 200) {
      try {
        const res = yield call(axios.get, `${baseUrl.BELLA}/profile/${userId}`);

        console.tron.log(res.data);
        if (res.status === 200) {
          yield put(signInSuccess(token, refresh_token));
          yield put(setSigned());
          yield put(saveProfile(res.data));
          history.push("/calls/lastcalls");
        }
      } catch (error) {
        console.tron.log(error);
      }
      // const profile = res.data;
      // yield put(availableButtons(true));
      // yield put(saveProfile(profile[0]));
      // yield put(saveAllProfile(profile));
    }
  } catch (error) {
    if (error.response) {
      console.tron.log(error.response);
      toast.error("Falha na autenticaçao, verifique seus dados");
    }
  }
}

// export function* signUp({ payload }) {
//   try {
//     const { name, email, password } = payload;

//     yield call(api.post, "users", {
//       name,
//       email,
//       password,
//       provider: true,
//     });

//     history.push("/");
//   } catch (error) {
//     toast.error("Falha no cadastro, verifique seus dados");
//     yield put(signFailure());
//   }
// }

// export function setToken({ payload }) {
//   if (!payload) return;

//   const { token } = payload.auth;

//   if (token) {
//     api.defaults.headers.Authorization = `Bearer ${token}`;
//   }
// }

export function signOut() {
  history.push("/");
}

export default all([
  // takeLatest("persist/REHYDRATE", setToken),
  takeLatest("@auth/SIGN_IN_REQUEST", signIn),
  // takeLatest("@auth/SIGN_UP_REQUEST", signUp),
  takeLatest("@auth/SIGN_OUT", signOut),
]);
