import { all, takeLatest, call, put, select } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";

import apiTerapia from '../../../services/apiTerapia';
import history from "../../../services/history";
import baseUrl from "../../../services/baseUrl";

import {removeAvatar} from "../../../helpers/uploadAvatar";

import { 
  signInSuccess,
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

import {availableButtons} from '../commons/actions';

export function* signIn({ payload }) {
  try {
    const data = {
      email: payload.email,
      password: payload.password,
    };

    const response = yield call(
      axios.post,
      `${baseUrl.TERAPIA_AUTH}/user/login/web`,
      data
    );

    const { access_token: token, refresh_token, userId } = response.data;

    axios.defaults.headers.Authorization = `Bearer ${token}`;

    if (response.status === 200) {
      try {
        const res = yield call(axios.get, `${baseUrl.TERAPIA_BELLA}/profile/${userId}`);

        if (res.status === 200) {
          console.log(res);

          yield put(availableButtons(true));
          yield put(signInSuccess(token, refresh_token));
          yield put(setSigned());
          yield put(saveProfile(res.data));
          history.push("/professionals");
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    if (error.response) {
      console.tron.log(error.response);
      toast.error("Falha na autenticação, verifique seus dados");
    }
  }
}

export function* requestCreateProfile({payload}) {
  const domainId = 1;
  const tenantId = 1;

  try {
    const responsePhone = yield call(
      axios.get,
      `${baseUrl.TERAPIA_BELLA}/profile/phone/${payload.phoneNumber}`,
    );

    if (responsePhone.status === 200) {
      yield put(setPhoneError());
      toast.error("Falha no cadastro, Telefone já cadastrado na nossa base de dados");
      if (payload.avatar !== '') {
        removeAvatar(payload.avatar);
      }
    }
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 500:
          yield put(cancelLoading());
          break;
        case 404:
          try {
            const responseEmail = yield call(
              axios.get,
              `${baseUrl.TERAPIA_BELLA}/profile/register/verify-non-existent-email?email=${payload.email}`,
            );
            if (responseEmail.status === 200) {
              try {
                const responseDoc = yield call(
                  axios.get,
                  `${baseUrl.TERAPIA_BELLA}/profile/register/verify-non-existent-doc?doc=${payload.doc}`,
                );
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

                        const {
                          access_token: token, userId,
                        } = responseToken.data;
        
                        axios.defaults.headers.Authorization = `Bearer ${token}`;
        
                        yield put(setUserId(token, userId));
        
                        if (responseToken.status === 200) {
                          yield put(setFCMToken(payload.fmcToken, userId));

                          if (payload.avatar === '') {
                            payload.avatar = `https://ui-avatars.com/api/?background=6B8BC8&color=fff&&name=${payload.name}`;
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
                              },
                            );

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
                                  history.push('/professionals');
                                }
                                yield put(availableButtons(true));
                                yield put(cancelLoading());
                              } catch(error) {
                                if (payload.avatar !== '') {
                                  removeAvatar(payload.avatar);
                                }
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
                            if (payload.avatar !== '') {
                              removeAvatar(payload.avatar);
                            }
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
                        if (payload.avatar !== '') {
                          removeAvatar(payload.avatar);
                        }
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
                    if (payload.avatar !== '') {
                      removeAvatar(payload.avatar);
                    }
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
                if (payload.avatar !== '') {
                  removeAvatar(payload.avatar);
                }
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
            if (payload.avatar !== '') {
              removeAvatar(payload.avatar);
            }
            yield put(availableButtons(true));
            yield put(cancelLoading());
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
}

export function* requestUpdateProfile({payload}) {
  const tokenn = (state) => state.auth.token;
  const token = yield select(tokenn);

  const profAvatar = (state) => state.list.clientProfile.photoUrl;
  const oldAvatar = yield select(profAvatar);

  const profPhone = (state) => state.list.clientProfile.phoneNumber;
  const oldPhone = yield select(profPhone);

  const profDoc = (state) => state.list.clientProfile.doc;
  const oldDoc = yield select(profDoc);

  const profEmail = (state) => state.list.clientProfile.email;
  const oldEmail = yield select(profEmail);

  let avatar = payload.profile.avatar;
  let phone = payload.profile.phoneNumber;
  let email = payload.profile.email;
  let docActual = payload.profile.doc;

  if (oldPhone === payload.profile.phoneNumber) {
    phone = payload.profile.phoneNumber;

    if (oldDoc === payload.profile.doc) {
      docActual = payload.profile.doc;

      if (oldEmail === payload.profile.email) {
        email = payload.profile.email;

        try {
          axios.defaults.headers.Authorization = `Bearer ${token}`;
      
          if (payload.profile.avatar !== oldAvatar) {
            avatar = payload.profile.avatar;
          } else {
            avatar = oldAvatar;
          }
      
          const responseProfileUpdate = yield call(
            axios.put,
            `${baseUrl.TERAPIA_BELLA}/profile/${payload.profile.userId}`,
            {
              id: payload.profile.userId,
              name: payload.profile.name,
              doc: docActual,
              email,
              birthDate: payload.profile.birthDate,
              phoneNumber: phone,
              photoUrl: avatar,
            },
          );
      
          if (responseProfileUpdate.status === 201) {
            try {
              const responseProfProfileUpdate = yield call(
                axios.put,
                `${baseUrl.TERAPIA_BELLA}/professional`,
                {
                  description: payload.profile.description,
                  docValue: payload.profile.docValue,
                  docDescription: payload.profile.docDescription,
                  value: Number(payload.profile.value),
                  pageUrl: payload.profile.pageUrl,
                  videoUrl: payload.profile.videoUrl,
                  id: payload.profile.professional.id,
                  graduates: payload.profile.graduates,
                  experiences: payload.profile.experiences,
                  specialties: payload.profile.specialties,
                },
              );
      
              if (responseProfProfileUpdate.status === 202) {
                yield put(cancelLoading());
                toast.success("Parabéns, Profissional Editado com Sucesso.");
                history.push('/professionals');
              }
              yield put(availableButtons(true));
              yield put(cancelLoading());
            } catch(error) {
              if (payload.profile.avatar !== oldAvatar) {
                removeAvatar(avatar);
              }
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
          yield put(availableButtons(true));
        } catch (error) {
          if (payload.profile.avatar !== oldAvatar) {
            removeAvatar(avatar);
          }
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
      } else {
        try {
          const responseEmail = yield call(
            axios.get,
            `${baseUrl.TERAPIA_BELLA}/profile/register/verify-non-existent-email?email=${payload.profile.email}`,
          );
    
          if (responseEmail.status === 200) {
            email = payload.profile.email;

            try {
              axios.defaults.headers.Authorization = `Bearer ${token}`;
          
              if (payload.profile.avatar !== oldAvatar) {
                avatar = payload.profile.avatar;
              } else {
                avatar = oldAvatar;
              }
          
              const responseProfileUpdate = yield call(
                axios.put,
                `${baseUrl.TERAPIA_BELLA}/profile/${payload.profile.userId}`,
                {
                  id: payload.profile.userId,
                  name: payload.profile.name,
                  doc: docActual,
                  email,
                  birthDate: payload.profile.birthDate,
                  phoneNumber: phone,
                  photoUrl: avatar,
                },
              );
          
              if (responseProfileUpdate.status === 201) {
                try {
                  const responseProfProfileUpdate = yield call(
                    axios.put,
                    `${baseUrl.TERAPIA_BELLA}/professional`,
                    {
                      description: payload.profile.description,
                      docValue: payload.profile.docValue,
                      docDescription: payload.profile.docDescription,
                      value: Number(payload.profile.value),
                      pageUrl: payload.profile.pageUrl,
                      videoUrl: payload.profile.videoUrl,
                      id: payload.profile.professional.id,
                      graduates: payload.profile.graduates,
                      experiences: payload.profile.experiences,
                      specialties: payload.profile.specialties,
                    },
                  );
          
                  if (responseProfProfileUpdate.status === 202) {
                    yield put(cancelLoading());
                    toast.success("Parabéns, Profissional Editado com Sucesso.");
                    history.push('/professionals');
                  }
                  yield put(availableButtons(true));
                  yield put(cancelLoading());
                } catch(error) {
                  if (payload.profile.avatar !== oldAvatar) {
                    removeAvatar(avatar);
                  }
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
              yield put(availableButtons(true));
            } catch (error) {
              if (payload.profile.avatar !== oldAvatar) {
                removeAvatar(avatar);
              }
              console.tron.log(error.response, 'UPDATE responseProfileUpdate');
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
          if (payload.profile.avatar !== oldAvatar) {
            removeAvatar(avatar);
          }
          console.tron.log(error.response, 'UPDATE responseEmail');
          yield put(cancelLoading());
    
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
                yield put(emailError());
                toast.error("Falha no Cadastro, E-mail já cadastrado na nossa base de dados.");
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
    } else {
      try {
        const responseDoc = yield call(
          axios.get,
          `${baseUrl.TERAPIA_BELLA}/profile/register/verify-non-existent-doc?doc=${payload.profile.doc}`,
        );
  
        if (responseDoc.status === 200) {
          docActual = payload.profile.doc;

          if (oldEmail === payload.profile.email) {
            email = payload.profile.email;

            try {
              axios.defaults.headers.Authorization = `Bearer ${token}`;
          
              if (payload.profile.avatar !== oldAvatar) {
                avatar = payload.profile.avatar;
              } else {
                avatar = oldAvatar;
              }
          
              const responseProfileUpdate = yield call(
                axios.put,
                `${baseUrl.TERAPIA_BELLA}/profile/${payload.profile.userId}`,
                {
                  id: payload.profile.userId,
                  name: payload.profile.name,
                  doc: docActual,
                  email,
                  birthDate: payload.profile.birthDate,
                  phoneNumber: phone,
                  photoUrl: avatar,
                },
              );
          
              if (responseProfileUpdate.status === 201) {
                try {
                  const responseProfProfileUpdate = yield call(
                    axios.put,
                    `${baseUrl.TERAPIA_BELLA}/professional`,
                    {
                      description: payload.profile.description,
                      docValue: payload.profile.docValue,
                      docDescription: payload.profile.docDescription,
                      value: Number(payload.profile.value),
                      pageUrl: payload.profile.pageUrl,
                      videoUrl: payload.profile.videoUrl,
                      id: payload.profile.professional.id,
                      graduates: payload.profile.graduates,
                      experiences: payload.profile.experiences,
                      specialties: payload.profile.specialties,
                    },
                  );
          
                  if (responseProfProfileUpdate.status === 202) {
                    yield put(cancelLoading());
                    toast.success("Parabéns, Profissional Editado com Sucesso.");
                    history.push('/professionals');
                  }
                  yield put(availableButtons(true));
                  yield put(cancelLoading());
                } catch(error) {
                  if (payload.profile.avatar !== oldAvatar) {
                    removeAvatar(avatar);
                  }
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
              yield put(availableButtons(true));
            } catch (error) {
              if (payload.profile.avatar !== oldAvatar) {
                removeAvatar(avatar);
              }
              console.tron.log(error.response, 'UPDATE responseProfileUpdate');
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
          } else {
            try {
              const responseEmail = yield call(
                axios.get,
                `${baseUrl.TERAPIA_BELLA}/profile/register/verify-non-existent-email?email=${payload.profile.email}`,
              );
        
              if (responseEmail.status === 200) {
                email = payload.profile.email;

                try {
                  axios.defaults.headers.Authorization = `Bearer ${token}`;
              
                  if (payload.profile.avatar !== oldAvatar) {
                    avatar = payload.profile.avatar;
                  } else {
                    avatar = oldAvatar;
                  }
              
                  const responseProfileUpdate = yield call(
                    axios.put,
                    `${baseUrl.TERAPIA_BELLA}/profile/${payload.profile.userId}`,
                    {
                      id: payload.profile.userId,
                      name: payload.profile.name,
                      doc: docActual,
                      email,
                      birthDate: payload.profile.birthDate,
                      phoneNumber: phone,
                      photoUrl: avatar,
                    },
                  );
              
                  if (responseProfileUpdate.status === 201) {
                    try {
                      const responseProfProfileUpdate = yield call(
                        axios.put,
                        `${baseUrl.TERAPIA_BELLA}/professional`,
                        {
                          description: payload.profile.description,
                          docValue: payload.profile.docValue,
                          docDescription: payload.profile.docDescription,
                          value: Number(payload.profile.value),
                          pageUrl: payload.profile.pageUrl,
                          videoUrl: payload.profile.videoUrl,
                          id: payload.profile.professional.id,
                          graduates: payload.profile.graduates,
                          experiences: payload.profile.experiences,
                          specialties: payload.profile.specialties,
                        },
                      );
              
                      if (responseProfProfileUpdate.status === 202) {
                        yield put(cancelLoading());
                        toast.success("Parabéns, Profissional Editado com Sucesso.");
                        history.push('/professionals');
                      }
                      yield put(availableButtons(true));
                      yield put(cancelLoading());
                    } catch(error) {
                      if (payload.profile.avatar !== oldAvatar) {
                        removeAvatar(avatar);
                      }
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
                  yield put(availableButtons(true));
                } catch (error) {
                  if (payload.profile.avatar !== oldAvatar) {
                    removeAvatar(avatar);
                  }
                  console.tron.log(error.response, 'UPDATE responseProfileUpdate');
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
              if (payload.profile.avatar !== oldAvatar) {
                removeAvatar(avatar);
              }
              console.tron.log(error.response, 'UPDATE responseEmail');
              yield put(cancelLoading());
        
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
                    yield put(emailError());
                    toast.error("Falha no Cadastro, E-mail já cadastrado na nossa base de dados.");
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
        }
      } catch (error) {
        console.tron.log(error.response, 'UPDATE responseDoc');
        if (payload.profile.avatar !== oldAvatar) {
          removeAvatar(avatar);
        }
        yield put(cancelLoading());
  
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
              toast.error("Falha no Cadastro, CPF já cadastrado na nossa base de dados.");
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
  } else {
    try {
      const responsePhone = yield call(
        axios.get,
        `${baseUrl.TERAPIA_BELLA}/profile/phone/${payload.profile.phoneNumber}`,
      );
  
      if (responsePhone.status === 200) {
        yield put(setPhoneError());
        toast.error("Falha no cadastro, Telefone já cadastrado na nossa base de dados");
      }
    } catch (error) {
      yield put(cancelLoading());
      if (payload.profile.avatar !== oldAvatar) {
        removeAvatar(avatar);
      }
      console.tron.log(error.response, 'UPDATE responsePhone');

      if (error.response) {
        switch (error.response.status) {
          case 500:
            break;
          case 404:
            console.tron.log(error.response, 'erro 404, bora');
            phone = payload.profile.phoneNumber;

            if (oldDoc === payload.profile.doc) {
              docActual = payload.profile.doc;

              if (oldEmail === payload.profile.email) {
                email = payload.profile.email
              } else {
                try {
                  const responseEmail = yield call(
                    axios.get,
                    `${baseUrl.TERAPIA_BELLA}/profile/register/verify-non-existent-email?email=${payload.profile.email}`,
                  );
            
                  if (responseEmail.status === 200) {
                    email = payload.profile.email;

                    try {
                      axios.defaults.headers.Authorization = `Bearer ${token}`;
                  
                      if (payload.profile.avatar !== oldAvatar) {
                        avatar = payload.profile.avatar;
                      } else {
                        avatar = oldAvatar;
                      }
                  
                      const responseProfileUpdate = yield call(
                        axios.put,
                        `${baseUrl.TERAPIA_BELLA}/profile/${payload.profile.userId}`,
                        {
                          id: payload.profile.userId,
                          name: payload.profile.name,
                          doc: docActual,
                          email,
                          birthDate: payload.profile.birthDate,
                          phoneNumber: phone,
                          photoUrl: avatar,
                        },
                      );
                  
                      if (responseProfileUpdate.status === 201) {
                        try {
                          const responseProfProfileUpdate = yield call(
                            axios.put,
                            `${baseUrl.TERAPIA_BELLA}/professional`,
                            {
                              description: payload.profile.description,
                              docValue: payload.profile.docValue,
                              docDescription: payload.profile.docDescription,
                              value: Number(payload.profile.value),
                              pageUrl: payload.profile.pageUrl,
                              videoUrl: payload.profile.videoUrl,
                              id: payload.profile.professional.id,
                              graduates: payload.profile.graduates,
                              experiences: payload.profile.experiences,
                              specialties: payload.profile.specialties,
                            },
                          );
                  
                          if (responseProfProfileUpdate.status === 202) {
                            yield put(cancelLoading());
                            toast.success("Parabéns, Profissional Editado com Sucesso.");
                            history.push('/professionals');
                          }
                          yield put(availableButtons(true));
                          yield put(cancelLoading());
                        } catch(error) {
                          if (payload.profile.avatar !== oldAvatar) {
                            removeAvatar(avatar);
                          }
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
                      yield put(availableButtons(true));
                    } catch (error) {
                      if (payload.profile.avatar !== oldAvatar) {
                        removeAvatar(avatar);
                      }
                      console.tron.log(error.response, 'UPDATE responseProfileUpdate');
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
                  if (payload.profile.avatar !== oldAvatar) {
                    removeAvatar(avatar);
                  }
                  console.tron.log(error.response, 'UPDATE responseEmail');
                  yield put(cancelLoading());
            
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
                        yield put(emailError());
                        toast.error("Falha no Cadastro, E-mail já cadastrado na nossa base de dados.");
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
            } else {
              try {
                const responseDoc = yield call(
                  axios.get,
                  `${baseUrl.TERAPIA_BELLA}/profile/register/verify-non-existent-doc?doc=${payload.profile.doc}`,
                );
          
                if (responseDoc.status === 200) {
                  docActual = payload.profile.doc;

                  if (oldEmail === payload.profile.email) {
                    email = payload.profile.email
                  } else {
                    try {
                      const responseEmail = yield call(
                        axios.get,
                        `${baseUrl.TERAPIA_BELLA}/profile/register/verify-non-existent-email?email=${payload.profile.email}`,
                      );
                
                      if (responseEmail.status === 200) {
                        email = payload.profile.email;

                        try {
                          axios.defaults.headers.Authorization = `Bearer ${token}`;
                      
                          if (payload.profile.avatar !== oldAvatar) {
                            avatar = payload.profile.avatar;
                          } else {
                            avatar = oldAvatar;
                          }
                      
                          const responseProfileUpdate = yield call(
                            axios.put,
                            `${baseUrl.TERAPIA_BELLA}/profile/${payload.profile.userId}`,
                            {
                              id: payload.profile.userId,
                              name: payload.profile.name,
                              doc: docActual,
                              email,
                              birthDate: payload.profile.birthDate,
                              phoneNumber: phone,
                              photoUrl: avatar,
                            },
                          );
                      
                          if (responseProfileUpdate.status === 201) {
                            try {
                              const responseProfProfileUpdate = yield call(
                                axios.put,
                                `${baseUrl.TERAPIA_BELLA}/professional`,
                                {
                                  description: payload.profile.description,
                                  docValue: payload.profile.docValue,
                                  docDescription: payload.profile.docDescription,
                                  value: Number(payload.profile.value),
                                  pageUrl: payload.profile.pageUrl,
                                  videoUrl: payload.profile.videoUrl,
                                  id: payload.profile.professional.id,
                                  graduates: payload.profile.graduates,
                                  experiences: payload.profile.experiences,
                                  specialties: payload.profile.specialties,
                                },
                              );
                      
                              if (responseProfProfileUpdate.status === 202) {
                                yield put(cancelLoading());
                                toast.success("Parabéns, Profissional Editado com Sucesso.");
                                history.push('/professionals');
                              }
                              yield put(availableButtons(true));
                              yield put(cancelLoading());
                            } catch(error) {
                              if (payload.profile.avatar !== oldAvatar) {
                                removeAvatar(avatar);
                              }
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
                          yield put(availableButtons(true));
                        } catch (error) {
                          if (payload.profile.avatar !== oldAvatar) {
                            removeAvatar(avatar);
                          }
                          console.tron.log(error.response, 'UPDATE responseProfileUpdate');
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
                      if (payload.profile.avatar !== oldAvatar) {
                        removeAvatar(avatar);
                      }
                      console.tron.log(error.response, 'UPDATE responseEmail');
                      yield put(cancelLoading());
                
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
                            yield put(emailError());
                            toast.error("Falha no Cadastro, E-mail já cadastrado na nossa base de dados.");
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
                }
              } catch (error) {
                console.tron.log(error.response, 'UPDATE responseDoc');
                if (payload.profile.avatar !== oldAvatar) {
                  removeAvatar(avatar);
                }
                yield put(cancelLoading());
          
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
                      toast.error("Falha no Cadastro, CPF já cadastrado na nossa base de dados.");
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
            break;
          default:
            break;
        }
      }
    }
  }
}

export function signOut() {
  history.push("/");
}

export default all([
  takeLatest("@auth/SIGN_IN_REQUEST", signIn),
  takeLatest('@auth/REQUEST_CREATE_PROFILE', requestCreateProfile),
  takeLatest('@auth/REQUEST_UPDATE_PROFILE', requestUpdateProfile),
  takeLatest("@auth/SIGN_OUT", signOut),
]);
