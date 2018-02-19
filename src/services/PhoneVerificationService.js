
import FirebaseService from 'services/FirebaseService'

class PhoneVerificationService {

  phoneNumber = null
  code = null
  serverCode = null

  constructor(phoneNumber, code){
    this.phoneNumber = phoneNumber
    this.code = parseInt(code)
  }

  async verificate(){
    this.serverCode = await FirebaseService.db().ref(`codes`).child(this.phoneNumber).once(`value`).then((snap) => snap.val())
  }

  isAvailable() {
    return this.serverCode !== null;
  }

  isCodeOk() {
    return this.serverCode === this.code;
  }
}

export default PhoneVerificationService;
