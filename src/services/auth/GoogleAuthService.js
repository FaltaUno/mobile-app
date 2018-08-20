import Config from 'config'
import { Google } from 'expo';
import AuthService from './AuthService'
import FirebaseService from '../FirebaseService'

class GoogleAuthService extends AuthService {

  type
  token
  credential
  user

  async doLogin() {
    const { type, token } = await Google.logInAsync({
      androidClientId: '1019925486930-eumcct814tpj56davlqklfh7ia7h99eq.apps.googleusercontent.com',
      iosClientId: '1060090907354-f982ds16pfvu5pqeqjkqa7pfd7s4hc9o.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    });

    this.token = token
    this.type = type
    
  }

  doGetCredential() {
    this.credential = FirebaseService.GoogleAuthProvider.credential(this.token)
    console.log("Credential is " , this.credential)
    return this.credential
  }

}

export default new GoogleAuthService();
