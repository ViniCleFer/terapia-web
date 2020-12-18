export function getProfileById(userId) {
  return {
    type: "@lists/GET_PROFILE_BY_ID",
    payload: { userId },
  };
}

export function setProfileById(data) {
  return {
    type: "@lists/SET_PROFILE_BY_ID",
    payload: { data },
  };
}

export function clearProfileById() {
  return {
    type: "@lists/CLEAR_PROFILE_BY_ID",
  };
}
