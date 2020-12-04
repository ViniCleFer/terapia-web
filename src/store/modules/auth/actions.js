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
