import { all, takeLatest, call, put } from "redux-saga/effects";
import { toast } from "react-toastify";
import qs from "qs-stringify";
import axios from "axios";

// import api from '../../../services/api';
import apiTerapia from '../../../services/apiTerapia';
import history from "../../../services/history";
import baseUrl from "../../../services/baseUrl";

import firebase from '../../../config/firebase';

import { signInSuccess,
  // signFailure,
  setSigned,
  saveProfile,
  setUserId,
  setFCMToken,
  cancelLoading,
  docError,
  emailError,
  failureAutenticationCode,
  setPhoneError,
 } from "./actions";

// import { getCompanyInfo } from "../company/actions";

import {availableButtons} from '../commons/actions';

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
          history.push("/professionals");
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

export function* requestCreateProfile({payload}) {
  let uid = null;

  const domainId = 1;
  const tenantId = 1;

  // const activationCodeIdReducer = (state) => state.auth.activationCodeId;
  // const activationCodeId = yield select(activationCodeIdReducer);

  console.tron.log({payload});

  if (payload.avatar === '') {
    payload.avatar = `https://ui-avatars.com/api/?background=6B8BC8&color=fff&&name=${payload.name}`;
  }

  // firebase.auth().onAuthStateChanged((user) => {
  //   if (user) {
  //     uid = user.uid;
  //   }
  // });

  try {
    const responsePhone = yield call(
      axios.get,
      `${baseUrl.TERAPIA_BELLA}/profile/phone/+55${payload.phoneNumber}`,
    );

    if (responsePhone.status === 200) {
      yield put(setPhoneError());
      toast.error("Falha no cadastro, Telefone já cadastrado na nossa base de dados");
    }
  } catch (error) {
    console.tron.log(error.response, 'getProfileByPhoneNumber');

    if (error.response) {
      switch (error.response.status) {
        case 500:
          break;
        case 404:
          console.tron.log(error.response, 'erro 404, bora');
          // try {
          //   const responseEmail = yield call(
          //     axios.get,
          //     `${baseUrl.TERAPIA_BELLA}/profile/register/verify-non-existent-email/${payload.email}`,
          //   );
          //   console.tron.log({responseEmail});
          //   if (responseEmail.status === 200) {
          //     try {
          //       const responseDoc = yield call(
          //         axios.get,
          //         `${baseUrl.TERAPIA_BELLA}/profile/register/verify-non-existent-doc/${payload.doc}`,
          //       );
          //       console.tron.log({responseDoc});
          //       if (responseDoc.status === 200) {
                  try {
                    const responseSignUp = yield call(apiTerapia.post, `${baseUrl.TERAPIA_AUTH}/signup`, {
                      email: payload.email,
                      password: '1234567',
                      username: payload.email,
                      domainId,
                      tenantId,
                    });
                    if (responseSignUp.status === 200) {
                      try {
                        // const data = qs({
                        //   grant_type: 'password',
                        //   // username: 'user1@teste.com',
                        //   username: payload.email,
                        //   password: '1234567',
                        // });

                        // console.tron.log(data, 'data');
        
                        const responseToken = yield call(
                          axios.post,
                          `${baseUrl.TERAPIA_AUTH}/user/login/web`,
                          {
                            email: payload.email,
                            password: '1234567',
                          }
                          // {
                          //   headers: {
                          //     Accept: '*/*',
                          //     'Content-Type': 'application/x-www-form-urlencoded',
                          //     Authorization: 'Basic bW9iaWxlOmJlbGxhQDIwMTk=',
                          //   },
                          // },
                        );

                        console.tron.log(responseToken, 'response');
        
                        const {
                          access_token: token, userId,
                        } = responseToken.data;
        
                        axios.defaults.headers.Authorization = `Bearer ${token}`;
        
                        yield put(setUserId(token, userId));
        
                        // const fcmId = (state) => state.auth.FCMToken;
                        // const fcm = yield select(fcmId);
        
                        if (responseToken.status === 200) {
                          yield put(setFCMToken(payload.fmcToken, userId));
                          try {
                            axios.defaults.headers.Authorization = `Bearer ${token}`;
                            const responseProfile = yield call(
                              // nome, doc, email, userId, activationCodeId
                              axios.post,
                              `${baseUrl.TERAPIA_BELLA}/profile`,
                              {
                                userId,
                                uId: 'web',
                                name: payload.name,
                                doc: payload.doc,
                                email: payload.email,
                                birthDate: payload.birthDate,
                                phoneNumber: payload.phoneNumber,
                                photoUrl: payload.avatar,
                                domainId,
                                tenantId,
                              },
                            );
        
                            console.tron.log(responseProfile, 'responseProfile')
        
                            // if (responseProfile) {
                            //   yield call(
                            //     axios.put,
                            //     `${baseUrl.TERAPIA_AUTH}/user/register-status/${userId}`,
                            //     {
                            //       registerStatus: 'COMPLETE',
                            //     },
                            //   );
                            // }
                            yield put(availableButtons(true));

                            const { id: profileId } = responseProfile.data;

                            if (responseProfile.status === 201) {

                              try {
                                const responseProfProfile = yield call(
                                  // nome, doc, email, userId, activationCodeId
                                  axios.post,
                                  `${baseUrl.TERAPIA_BELLA}/professional`,
                                  {
                                    description: payload.about,
                                    docValue: payload.docValue,
                                    docDescription: payload.docDescription,
                                    value: payload.value,
                                    pageUrl: payload.pageUrl,
                                    videoUrl: payload.videoUrl,
                                    profileId,
                                    graduates: payload.graduates,
                                    experiences: payload.experiences,
                                    specialties: payload.specialties,
                                  },
                                );
  
                                if (responseProfProfile.status === 200) {
                                  toast.success("Parabéns, Profissional Cadastrado com Sucesso.");
                                }
                                yield put(availableButtons(true));
                              } catch(error) {
                                console.tron.log(error.response, 'Error responseProfProfile');
                                yield put(availableButtons(true));
                                if (error.response) {
                                  switch (error.response.status) {
                                    case 500:
                                      break;
                                    case 404:
                                      break;
                                    case 400:
                                      break;
                                    default:
                                      break;
                                  }
                                }
                              }
                            }
                          } catch (error) {
                            console.tron.log(error, 'Error responseProfile');
                            yield put(availableButtons(true));
                            if (error.response) {
                              console.tron.log(error.response);
                              switch (error.response.status) {
                                case 500:
                                  break;
                                case 404:
                                  break;
                                case 400:
                                  break;
                                default:
                                  break;
                              }
                            }
                          }
                        }
                      } catch (error) {
                        console.tron.log(error, 'Error responseToken');
                        console.log(error, 'Error responseToken');
                        yield put(availableButtons(true));
                        if (error.response) {
                          switch (error.response.status) {
                            case 500:
                              break;
                            case 404:
                              break;
                            case 400:
                              break;
                            default:
                              break;
                          }
                        }
                      }
                    }
                  } catch (error) {
                    console.tron.log(error.response, 'Error responseSignUp');
                    yield put(availableButtons(true));
                    if (error.response) {
                      switch (error.response.status) {
                        case 500:
                          break;
                        case 404:
                          break;
                        case 400:
                          break;
                        case 409:
                          toast.error("Falha no Cadastro, E-mail já cadastrado na nossa base de dados.");
                          yield put(emailError());
                          yield put(cancelLoading());
                          break;
                        default:
                          break;
                      }
                    }
                  }
                // }
            //   } catch (error) {
            //     yield put(cancelLoading());
            //     yield put(availableButtons(true));
            //     console.tron.log(error.response, 'API AUTH DOC requestCreateProfile');
        
            //     if (error.response) {
            //       switch (error.response.status) {
            //         case 500:
            //           break;
            //         case 404:
            //           yield put(failureAutenticationCode('404'));
            //           break;
            //         case 400:
            //           yield put(failureAutenticationCode('400'));
            //           break;
            //         case 409:
            //           yield put(cancelLoading());
            //           yield put(docError());
            //           toast.error("Falha no Cadastro, CPF já cadastrado na nossa base de dados.");
            //           break;
            //         case 401:
            //           yield put(failureAutenticationCode('401'));
            //           break;
            //         default:
            //           break;
            //       }
            //     }
            //   }
            // }
          // } catch (error) {
          //   yield put(availableButtons(true));
          //   yield put(cancelLoading());
          //   console.tron.log(error.response, 'API AUTH EMAIL requestCreateProfile');
        
          //   if (error.response) {
          //     switch (error.response.status) {
          //       case 500:
          //         break;
          //       case 404:
          //         yield put(emailError());
          //         break;
          //       case 400:
          //         yield put(failureAutenticationCode('400'));
          //         break;
          //       case 409:
          //         toast.error("Falha no Cadastro, E-mail já cadastrado na nossa base de dados.");
          //         yield put(emailError());
          //         break;
          //       case 401:
          //         yield put(failureAutenticationCode('401'));
          //         break;
          //       default:
          //         break;
          //     }
          //   }
          // }
          break;
        case 400:
          break;
        default:
          break;
      }
    }
  }

  // firebase
  //   .auth()
  //   .signInWithEmailAndPassword(payload.email, payload.password)
  //   .catch((error) => {
  //     if (error.code === 'auth/user-not-found') {
  //       uid = null;
  //     }
  //   });
}

export function signOut() {
  history.push("/");
}

export default all([
  // takeLatest("persist/REHYDRATE", setToken),
  takeLatest("@auth/SIGN_IN_REQUEST", signIn),
  takeLatest('@auth/REQUEST_CREATE_PROFILE', requestCreateProfile),
  // takeLatest("@auth/SIGN_UP_REQUEST", signUp),
  takeLatest("@auth/SIGN_OUT", signOut),
]);
