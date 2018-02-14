import FirebaseService from 'services/FirebaseService'

class UserService {
  users = {};
  usersRef;

  async me() {
    const uid = FirebaseService.user().uid
    if (!this.users[uid]) {
      this.usersRef = FirebaseService.db().ref(`users`)
      const snap = await this.usersRef.child(uid).once(`value`)
      this.users[uid] = snap.val()
      this.users[uid].key = uid
      return this.users[snap.key]
    }

    return Promise.resolve(this.users[uid]);
  }

  update(user){
    this.usersRef.child(user.key).update(user);
  }

  setMyPhone(phone){
    const uid = FirebaseService.user().uid
    let user = Object.assign({}, this.users[uid], { phone })
    this.users[uid] = user
    this.usersRef.child(uid).update({ phone })
  }

  myPhoneIsVerified() {
    const uid = FirebaseService.user().uid
    this.users[uid].phoneVerified = true
    this.usersRef.child(uid).update({ phoneVerified: true })
  }

  setMyLocation(position, location){
    const uid = FirebaseService.user().uid

    const data = {
      locationPermission: true,
      position,
      location,
    }
    let user = Object.assign({}, this.users[uid], data)

    this.users[uid] = user
    this.usersRef.child(uid).update(data)
  }

  firstTimeIsDone(){
    const uid = FirebaseService.user().uid
    this.users[uid].firstTime = false
    this.usersRef.child(uid).update({ firstTime: false })
  }
}

export default new UserService();
