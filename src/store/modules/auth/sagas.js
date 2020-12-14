import { all, takeLatest, call, put, select } from "redux-saga/effects";
import { toast } from "react-toastify";
// import qs from "qs-stringify";
import axios from "axios";
import {v4 as uuid} from 'uuid';

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
      `${baseUrl.TERAPIA_AUTH}/user/login/web`,
      data
    );

    console.tron.log(response);

    const { access_token: token, refresh_token, userId } = response.data;

    axios.defaults.headers.Authorization = `Bearer ${token}`;

    if (response.status === 200) {
      try {
        const res = yield call(axios.get, `${baseUrl.TERAPIA_BELLA}/profile/${userId}`);

        console.tron.log(res.data);
        if (res.status === 200) {
          yield put(signInSuccess(token, refresh_token));
          yield put(setSigned());
          yield put(saveProfile(res.data));
          history.push("/professionals/contacts");
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
  // let uid = null;

  const domainId = 1;
  const tenantId = 1;

  // const activationCodeIdReducer = (state) => state.auth.activationCodeId;
  // const activationCodeId = yield select(activationCodeIdReducer);

  console.tron.log({payload});

  const handleAvatar = async (fileImage) => {
    const file = fileImage.target.files[0];
    const id = uuid();
    const handleImage = firebase.storage().ref('avatar').child(id);
    await handleImage.put(file);
    handleImage.getDownloadURL().then(url => {
      return payload.avatar = url;
    })
  };

  // const specialties = payload.specialties.map(specialty => {
  //   id: specialty.id
  // });

  // firebase.auth().onAuthStateChanged((user) => {
  //   if (user) {
  //     uid = user.uid;
  //   }
  // });

  try {
    const responsePhone = yield call(
      axios.get,
      `${baseUrl.TERAPIA_BELLA}/profile/phone/${payload.phoneNumber}`,
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
          yield put(cancelLoading());
          break;
        case 404:
          console.tron.log(error.response, 'erro 404, bora');
          try {
            const responseEmail = yield call(
              axios.get,
              `${baseUrl.TERAPIA_BELLA}/profile/register/verify-non-existent-email?email=${payload.email}`,
            );
            console.tron.log({responseEmail});
            if (responseEmail.status === 200) {
              try {
                const responseDoc = yield call(
                  axios.get,
                  `${baseUrl.TERAPIA_BELLA}/profile/register/verify-non-existent-doc?doc=${payload.doc}`,
                );
                console.tron.log({responseDoc});
                if (responseDoc.status === 200) {
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
                        const responseToken = yield call(
                          axios.post,
                          `${baseUrl.TERAPIA_AUTH}/user/login/web`,
                          {
                            email: payload.email,
                            password: '1234567',
                          }
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

                          if (payload.avatar === '') {
                            payload.avatar = `https://ui-avatars.com/api/?background=6B8BC8&color=fff&&name=${payload.name}`;
                          } else {
                            handleAvatar(payload.avatar);
                          }

                          try {
                            axios.defaults.headers.Authorization = `Bearer ${token}`;
                            const responseProfile = yield call(
                              axios.post,
                              `${baseUrl.TERAPIA_BELLA}/profile`,
                              {
                                userId,
                                name: payload.name,
                                doc: payload.doc,
                                email: payload.email,
                                birthDate: payload.birthDate,
                                phoneNumber: payload.phoneNumber,
                                photoUrl: payload.avatar,
                                domainId,
                                tenantId,
                                address: [
                                  {
                                    address: payload.address,
                                    number: payload.number,
                                    complement: payload.complement,
                                    neighborhood: payload.neighborhood,
                                    state: payload.state,
                                    city: payload.city,
                                    zipCode: payload.cep,
                                  },
                                ],
                              },
                            );
        
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
                                  axios.post,
                                  `${baseUrl.TERAPIA_BELLA}/professional`,
                                  {
                                    description: payload.description,
                                    docValue: payload.docValue,
                                    docDescription: payload.docDescription,
                                    value: Number(payload.value),
                                    pageUrl: payload.pageUrl,
                                    videoUrl: payload.videoUrl,
                                    profileId,
                                    graduates: payload.graduates,
                                    experiences: payload.experiences,
                                    specialties: payload.specialties,
                                  },
                                );
  
                                if (responseProfProfile.status === 200) {
                                  yield put(cancelLoading());
                                  toast.success("Parabéns, Profissional Cadastrado com Sucesso.");
                                  window.location.reload();
                                }
                                yield put(availableButtons(true));
                                yield put(cancelLoading());
                              } catch(error) {
                                console.tron.log(error.response, 'Error responseProfProfile');
                                yield put(cancelLoading());
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
                            yield put(cancelLoading());
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
                        yield put(cancelLoading());
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
                    yield put(cancelLoading());
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
                }
              } catch (error) {
                yield put(cancelLoading());
                yield put(availableButtons(true));
                console.tron.log(error.response, 'API AUTH DOC requestCreateProfile');
        
                if (error.response) {
                  switch (error.response.status) {
                    case 500:
                      break;
                    case 404:
                      yield put(failureAutenticationCode('404'));
                      break;
                    case 400:
                      yield put(failureAutenticationCode('400'));
                      break;
                    case 409:
                      yield put(cancelLoading());
                      yield put(docError());
                      toast.error("Falha no Cadastro, CPF já cadastrado na nossa base de dados.");
                      break;
                    case 401:
                      yield put(failureAutenticationCode('401'));
                      break;
                    default:
                      break;
                  }
                }
              }
            }
          } catch (error) {
            yield put(availableButtons(true));
            yield put(cancelLoading());
            console.tron.log(error.response, 'API AUTH EMAIL requestCreateProfile');
        
            if (error.response) {
              switch (error.response.status) {
                case 500:
                  break;
                case 404:
                  yield put(emailError());
                  break;
                case 400:
                  yield put(failureAutenticationCode('400'));
                  break;
                case 409:
                  toast.error("Falha no Cadastro, E-mail já cadastrado na nossa base de dados.");
                  yield put(emailError());
                  break;
                case 401:
                  yield put(failureAutenticationCode('401'));
                  break;
                default:
                  break;
              }
            }
          }
          break;
        case 400:
          yield put(cancelLoading());
          break;
        case 'Network':
          console.tron.log('Possível erro de CORS');
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

export function* requestUpdateProfile({payload}) {
  // const birthdateValid = DateHelper.formatDateToPersist(birthDate);

  const tokenn = (state) => state.auth.token;
  const token = yield select(tokenn);

  const avatarr = (state) => state.auth.profile.photoUrl;
  let avatar = yield select(avatarr);

  if (avatar === null) {
    avatar = `https://ui-avatars.com/api/?background=6B8BC8&color=fff&&name=${payload.data.name}`;
  }

  try {
    const responseEmail = yield call(
      axios.get,
      `${baseUrl.TERAPIA_BELLA}/profile/register/verify-non-existent-email?email=${payload.email}`,
    );
    if (responseEmail.status === 200) {
      try {
        const responseDoc = yield call(
          axios.get,
          `${baseUrl.BELLA}/profile/register/verify-non-existent-doc/${payload.data.doc}`,
        );
        if (responseDoc.status === 200) {
          try {
            axios.defaults.headers.Authorization = `Bearer ${token}`;
            // yield put(setUserId(token, userId));

            if (responseDoc.status === 200) {
              try {
                axios.defaults.headers.Authorization = `Bearer ${token}`;
                const res = yield call(
                  // nome, doc, email, userId, activationCodeId
                  axios.put,
                  `${baseUrl.BELLA}/profile/${payload.data.userId}`,
                  {
                    id: payload.data.userId,
                    name: payload.data.name,
                    doc: payload.data.doc,
                    email: payload.data.email,
                    birthDate: payload.data.birthdateValid,
                    phoneNumber: payload.data.phoneNumber,
                    photoUrl: avatar,
                    address: [
                      {
                        address: payload.data.address,
                        number: payload.data.number,
                        complement: payload.data.complement,
                        neighborhood: payload.data.neighborhood,
                        state: payload.data.state,
                        city: payload.data.city,
                        zipCode: payload.data.cep,
                      },
                    ],
                  },
                );
                if (res) {
                  const profile = res.data;
                  yield put(saveProfile(profile));
                  yield put(signInSuccess(token));
                  // const status = yield call(
                  //   axios.put,
                  //   `${baseUrl.AUTH}/user/register-status/${payload.data.userId}`,
                  //   {
                  //     registerStatus: 'COMPLETE',
                  //   },
                  // );
                }
                yield put(availableButtons(true));
                yield put(setSigned());
                // yield put(profileComplete());
              } catch (error) {
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
            yield put(setUserId(token, payload.data.userId));
            yield put(signInSuccess(token));
            yield put(setSigned());
            yield put(cancelLoading());
            yield put(availableButtons(true));
          } catch (error) {
            yield put(availableButtons(true));
            yield put(cancelLoading());
            console.tron.log(error, 'API AUTH requestSetRegisterUser');
            if (error.response) {
              yield put(availableButtons(true));

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
        yield put(availableButtons(true));
        yield put(cancelLoading());
        console.tron.log(error, 'API SIGNUP');
        if (error.response) {
          switch (error.response.status) {
            case 500:
              break;
            case 404:
              break;
            case 400:
              break;
            case 409:
              yield put(docError());
              break;
            default:
              break;
          }
        }
      }
    }
  } catch (error) {
    yield put(availableButtons(true));
    if (error.response) {
      switch (error.response.status) {
        case 500:
          break;
        case 404:
          yield put(failureAutenticationCode('404'));
          break;
        case 400:
          yield put(failureAutenticationCode('400'));
          break;
        case 409:
          yield put(cancelLoading());
          yield put(docError());
          break;
        case 401:
          yield put(failureAutenticationCode('401'));
          break;
        default:
          break;
      }
    }
  }
}

export function signOut() {
  history.push("/");
}

export default all([
  // takeLatest("persist/REHYDRATE", setToken),
  takeLatest("@auth/SIGN_IN_REQUEST", signIn),
  takeLatest('@auth/REQUEST_CREATE_PROFILE', requestCreateProfile),
  takeLatest('@auth/REQUEST_UPDATE_PROFILE', requestUpdateProfile),
  // takeLatest("@auth/SIGN_UP_REQUEST", signUp),
  takeLatest("@auth/SIGN_OUT", signOut),
]);
