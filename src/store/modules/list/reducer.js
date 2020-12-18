import produce from "immer";

const INITIAL_STATE = {
  clientProfile: {},
};

export default function list(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case "@lists/SET_PROFILE_BY_ID": {
        draft.clientProfile = action.payload.data;
        break;
      }
      case "@lists/CLEAR_PROFILE_BY_ID": {
        draft.clientProfile = '';
        break;
      }
      default:
    }
  });
}
