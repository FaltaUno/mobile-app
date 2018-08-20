import Config from 'config'
import { Facebook } from 'expo';
import AuthService from './AuthService'
import FirebaseService from '../FirebaseService'

class FacebookAuthService extends AuthService {

  type
  token
  credential
  user

  async doLogin() {
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
  }

  doGetCredential() {
    this.credential = FirebaseService.FacebookAuthProvider.credential(this.token)
    return this.credential
  }

}

export default new FacebookAuthService();
