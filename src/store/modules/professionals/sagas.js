import { all, takeLatest, call, put, select } from "redux-saga/effects";
import { toast } from "react-toastify";
// import qs from "qs-stringify";
import axios from "axios";
// import {v4 as uuid} from 'uuid';

// import api from '../../../services/api';
// import apiTerapia from '../../../services/apiTerapia';
// import history from "../../../services/history";
import baseUrl from "../../../services/baseUrl";

// import firebase from '../../../config/firebase';

import { 
  getAllProfessionalsSuccess,
  // signFailure,
  // setSigned,
  // saveProfile,
  // setUserId,
  // setFCMToken,
  // cancelLoading,
  // docError,
  // emailError,
  // failureAutenticationCode,
  // setPhoneError,
 } from "./actions";

// import { getCompanyInfo } from "../company/actions";

// import {availableButtons} from '../commons/actions';

export function* getProfessionals({ payload }) {

  try {
    const tokenn = (state) => state.auth.token;
    const token = yield select(tokenn);

    axios.defaults.headers.Authorization = `Bearer ${token}`;

    const response = yield call(
      axios.get,
      `${baseUrl.TERAPIA_BELLA}/professional/all`,
    );

    if (response.status === 200) {
      const professionals = response.data;

      yield put(getAllProfessionalsSuccess(professionals));
    }
  } catch (error) {
    if (error.response) {
      console.tron.log(error.response, 'Erro getProfessionals');
      toast.error("Falha na autenticaçao, verifique seus dados");
    }
  }
}

export function* changeProfessionalsStatus({ payload }) {

  try {
    const tokenn = (state) => state.auth.token;
    const token = yield select(tokenn);

    axios.defaults.headers.Authorization = `Bearer ${token}`;

    console.tron.log(payload, 'PAYLOAD');

    const response = yield call(
      axios.put,
      `${baseUrl.TERAPIA_BELLA}/professional/status?professionalId=${payload.professionalId}&active=${payload.professionalStatus}`,
    );

    if (response.status === 200) {
      const professionals = response.data;
      yield put(getAllProfessionalsSuccess(professionals));
    }
  } catch (error) {
    if (error.response) {
      console.tron.log(error.response, 'Erro getProfessionals');
      toast.error("Falha na autenticaçao, verifique seus dados");
    }
  }
}


// PUT URL: {{urlBella}}/professional/status?professionalId=8343&active=true

export default all([
  // takeLatest("persist/REHYDRATE", setToken),
  takeLatest("@professionals/GET_ALL_PROFESSIONALS_REQUEST", getProfessionals),
  takeLatest("@professionals/SET_CHANGE_PROFESSIONAL_STATUS", changeProfessionalsStatus),
]);
