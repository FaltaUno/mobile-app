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

  async setMyLocation(position, location){
    const me = await this.me()

    const data = {
      locationPermission: true,
      position,
      location,
    }
    let user = Object.assign({}, me, data)

    this.users[me.key] = user
    this.usersRef.child(me.key).update(data)

    return this.me()
  }

  firstTimeIsDone(){
    const uid = FirebaseService.user().uid
    this.users[uid].firstTime = false
    this.users[uid].available = true
    this.usersRef.child(uid).update({ firstTime: false, available: true })
  }

  async setPushToken(pushToken){
    const me = await this.me()
    let user = Object.assign({}, this.users[me.key], { pushToken })
    this.users[me.key] = user
    this.usersRef.child(me.key).update({ pushToken })
  }

  readOnce(userKey){
    return this.usersRef.child(userKey).once('value').then(snap => {
      let user = snap.val()
      user.key = snap.key;
      return user;
    })
  }
}

export default new UserService();
