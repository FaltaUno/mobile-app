import FirebaseService from "./FirebaseService";

let ref = null;

export const getInviteRef = () => {
  if (!ref) {
    ref = FirebaseService.db().ref(`invites`);
  }
  return ref;
};

export default {
  getInviteRef,
};
