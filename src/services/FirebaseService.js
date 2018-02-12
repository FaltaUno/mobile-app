import Firebase from 'firebase'
import Config from 'config'

class FirebaseService {

  app = null //Firebase app

  init() {
    // Start firebase connection
    this.app = Firebase.initializeApp(Config.firebase);
  }

  user() {
    return this.app.auth().currentUser
  }

  db() {
    return this.app.database()
  }

  // isLoggedIn() {
  //   return this.app.auth().onAuthStateChanged((user) => {
  //     this.user = user
  //     return user != null
  //   })
  // }
}

export default new FirebaseService();
