
import Config from 'config'

import FirebaseService from 'services/FirebaseService'

export default class AuthService {

  type
  token
  credential
  user
  
  async logIn() {
    await this.doLogin();
    return this.isLogged()
  }

  // abstract method to be implemented in all our sign-in providers
  async doLogin() {
    throw new Error('You have to implement the method doLogin()!');
  }

  doGetCredential() {
    throw new Error('You have to implement the method doGetCredential()!');
  }

  getCredential() {
    if (this.isLogged()) {
      return this.doGetCredential();
    }
    return false
  }

  signIn() {
    const credential = this.getCredential()
    return FirebaseService.auth().signInWithCredential(credential).then((user) => this.parseUser(user))
  }

  signOut(){
    return FirebaseService.auth().signOut()
  }

  isLogged() {
    return this.type === 'success'
  }

  isCancelled() {
    return this.type === 'cancel'
  }

  async parseUser(firebaseUser) {
    const userRef = FirebaseService.db().ref(`users`).child(firebaseUser.uid)
    let snap = await userRef.once('value')
    let user = snap.val()
    // If the user is new, create with default values
    if (user === null) {
      user = firebaseUser.providerData[0]
      user.createdAt = new Date(firebaseUser.metadata.creationTime).getTime();

      // Default values
      user.firstTime = true
      user.phoneVerified = false
      user.locationPermission = false

      // Operation data
      user.available = false
      user.filterByDistance = true
      user.distance = 15

      userRef.set(user)
    }

    user.key = snap.key
    return user
  }

  onAuthStateChanged(callback) {
    return FirebaseService.auth().onAuthStateChanged(async (firebaseUser) => {
      // If the user exists
      if (!firebaseUser) {
        return callback(false, false)
      }
      // Get the database info
      let user = await this.parseUser(firebaseUser)
      const isRegistered = user !== null

      if (!isRegistered) {
        return callback(false, false)
      }

      // Listen for firstTime change
      // and execute the callback when it changes
      return FirebaseService.db().ref(`users`).child(user.key).child(`firstTime`).on('value', (snap) => {
        let firstTime = snap.val()
        if(firstTime === null){
          firstTime = undefined
        }
        callback(true, firstTime);
      })
    })
  }
}