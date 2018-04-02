import React from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
import { Text, Button, Icon } from 'react-native-elements';
import { format } from 'libphonenumber-js';

import Lang from 'lang';
import Colors from 'constants/Colors';

import PhoneVerificationService from 'services/PhoneVerificationService';
import CodeVerificationInput from 'components/CodeVerificationInput';
import UserService from 'services/UserService';
import FadeInFromTop from '../components/animations/FadeInFromTop';

export default class PhoneVerificationScreen extends React.Component {
  static navigationOptions = () => ({
    title: Lang.t('welcome.phoneVerification.headerTitle'),
    header: null
  });

  state = {
    checking: false,
  }

  countries = ['AR', 'UY']

  _goBack() { this.props.navigation.goBack() }

  render() {
    const { phone, country } = this.props.navigation.state.params

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Button 
          icon={ <Icon name={(Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back')} size={20}
          type="ionicon" color={Colors.primary} /> }
          title={Lang.t(`welcome.phoneVerification.backText`)} clear={true} 
          titleStyle={ { color: Colors.primary, fontSize: 20 } }
          containerStyle={ styles.backButtonContainer } onPress={ () => { this._goBack() } }
        />

        <FadeInFromTop delay={500}>
          <Text h2 style={styles.title}>{Lang.t('welcome.phoneVerification.title')}</Text>
          <Text style={styles.description}>{Lang.t('welcome.phoneVerification.description', { phone: format({ phone, country }, 'International') })}</Text>
        </FadeInFromTop>
        <CodeVerificationInput ref={(c) => this._codeVerificationInput = c} disabled={this.state.checking} onFinish={(code) => this.checkCode(code)} />
      </KeyboardAvoidingView>
    );
  }

  async checkCode(code) {
    this.setState({ checking: true })
    const { phone, country } = this.props.navigation.state.params

    const phoneData = { phone, country }
    const phoneNumber = format(phoneData, 'E.164');
    const phoneNumberInternational = format(phoneData, 'International');

    let phoneVerification = new PhoneVerificationService(phoneNumber, code)
    await phoneVerification.verificate()

    if (!phoneVerification.isAvailable()) {
      Alert.alert(Lang.t('welcome.phoneVerification.phoneNumberDisabled', { phone: phoneNumberInternational }))
      this.setState({ checking: false })
      this.props.navigation.goBack();
      return
    }

    this.setState({ checking: false })
    this._codeVerificationInput.clear()
    
    if (!phoneVerification.isCodeOk()) {
      Alert.alert(Lang.t('welcome.phoneVerification.codeDoesNotMatch'))
      return
    }

    UserService.setMyPhone(phoneData);
    UserService.myPhoneIsVerified()
    this.props.navigation.navigate('PhoneConfirmation', phoneData)
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
  },
  title: {
    marginTop: 20,
    textAlign: 'center'
  },
  description: {
    textAlign: 'center',
    fontSize: 20,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonDisabled: {
    backgroundColor: Colors.muted,
  },
  button: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  buttonText: {
    width: '100%',
    textAlign: 'center',
  },
  loading: {
    paddingTop: 9,
    paddingBottom: 9,
    width: '100%',
  },
  backButtonContainer: {
    /* This is used to move a single element to the left when a whole view is inside a flex display with 
      justifyContent: 'center' */
    marginRight: 'auto',
    paddingLeft: 10,
    position: 'absolute',
    top: 25
  },
  backButtonIcon: {
    color: Colors.light
  }
});
