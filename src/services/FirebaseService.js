import Firebase from "firebase";
import Config from "config";

class FirebaseService {
  app = null; //Firebase app
  FacebookAuthProvider = Firebase.auth.FacebookAuthProvider;
  GoogleAuthProvider = Firebase.auth.GoogleAuthProvider;

  init() {
    // Start firebase connection
    this.app = Firebase.initializeApp(Config.firebase);
  }

  auth() {
    return this.app.auth();
  }

  providerId() {
    return this.auth().AuthCredential.providerId();
  }

  user() {
    return this.auth().currentUser;
  }

  db() {
    return this.app.database();
  }

  normalizeSnap(snap) {
    let element = snap.val();
    element.key = snap.key;
    return element;
  }

  // isLoggedIn() {
  //   return this.app.auth().onAuthStateChanged((user) => {
  //     this.user = user
  //     return user != null
  //   })
  // }
}

export default new FirebaseService();
