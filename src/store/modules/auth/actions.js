export function signInRequest(email, password) {
  return {
    type: "@auth/SIGN_IN_REQUEST",
    payload: { email, password },
  };
}

export function signInSuccess(token, user) {
  return {
    type: "@auth/SIGN_IN_SUCCESS",
    payload: { token, user },
  };
}

export function signUpRequest(name, email, password) {
  return {
    type: "@auth/SIGN_UP_REQUEST",
    payload: { name, email, password },
  };
}

export function signFailure() {
  return {
    type: "@auth/SIGN_FAILURE",
  };
}

export function signOut() {
  return {
    type: "@auth/SIGN_OUT",
  };
}

export function setSigned() {
  return {
    type: "@auth/SET_SIGNED",
    payload: {},
  };
}

export function saveProfile(profile) {
  return {
    type: "@auth/SAVE_PROFILE",
    payload: { profile },
  };
}

export function setActiveCallData(data) {
  return {
    type: "@auth/SET_ACTIVE_CALL_DATA",
    payload: { data },
  };
}

export function requestCreateProfile({
  userId,
  uid,
  name,
  doc,
  email,
  birthdateValid,
  phoneNumber,
  avatar,
  address,
  number,
  complement,
  neighborhood,
  state,
  city,
  cep,
}) {
  return {
    type: '@auth/REQUEST_CREATE_PROFILE',
    payload: {
      userId,
      uid,
      name,
      doc,
      email,
      birthdateValid,
      phoneNumber,
      avatar,
      address,
      number,
      complement,
      neighborhood,
      state,
      city,
      cep,
    },
  };
}

export function clearDocError() {
  return {
    type: '@auth/CLEAR_DOC_ERROR',
    payload: {},
  };
}

export function setValidDoc(status) {
  return {
    type: '@auth/SET_VALID_DOC',
    payload: {status},
  };
}

export function setBirthError() {
  return {
    type: '@auth/SET_BIRTH_ERROR',
    payload: {},
  };
}

export function clearBirthError() {
  return {
    type: '@auth/CLEAR_BIRTH_ERROR',
    payload: {},
  };
}

export function setValidEmail(status) {
  return {
    type: '@auth/SET_VALID_EMAIL',
    payload: {status},
  };
}