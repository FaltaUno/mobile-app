
import { Facebook } from 'expo';

import Config from 'config'

import FirebaseService from 'services/FirebaseService'

class AuthService {

  type
  token
  credential
  user

  async logIn() {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(Config.facebook.appId, {
      permissions: [
        // -- Default Expo Permissions -- //
        'public_profile',
        'email',
        // 'user_friends',

        // -- Custom permissions -- //
        'user_birthday',
      ]
    });

    this.token = token
    this.type = type

    return this.isLogged()
  }

  getCredential() {
    // Build Firebase credential with the Facebook access token.
    if (this.isLogged()) {
      this.credential = FirebaseService.FacebookAuthProvider.credential(this.token)
      return this.credential
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
    // If the user is new, stamp the creation time
    if (user === null) {
      user = firebaseUser.providerData[0]
      user.createdAt = new Date(firebaseUser.metadata.creationTime).getTime();

      // Default values
      user.firstTime = true
      user.phoneVerified = false
      user.locationPermission = false

      // Op data
      user.available = true
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
        callback(true, snap.val());
      })
    })
  }
}

export default new AuthService();
