import FirebaseService from 'services/FirebaseService'

class UserService {
  user = null;

  async me() {
    if (this.user === null) {
      const uid = FirebaseService.user().uid
      this.user = await FirebaseService.db().ref(`users`).child(uid).once(`value`).then((snap) => snap.val())
    }

    return this.user;
  }
}

export default new UserService();
