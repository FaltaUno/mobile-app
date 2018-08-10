import FirebaseService from "./FirebaseService";

let ref = null;

export const getInviteRef = () => {
  if (!ref) {
    ref = FirebaseService.db().ref(`invites`);
  }
  return ref;
};

export const getInvite = key => {
  return getInviteRef()
    .child(key)
    .once("value")
    .then(snap => {
      return FirebaseService.normalizeSnap(snap);
    });
};

export const getInvites = keys => {
  let invites$ = [];
  keys.map(key => invites$.push(getInvite(key)));
  return Promise.all(invites$);
};

export default {
  getInviteRef,
  getInvite,
  getInvites
};
