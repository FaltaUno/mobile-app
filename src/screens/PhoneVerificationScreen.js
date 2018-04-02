import React from 'react';
import { Alert, View, StyleSheet, Platform } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { format } from 'libphonenumber-js';

import Lang from 'lang';
import Colors from 'constants/Colors';

import { Ionicons } from '@expo/vector-icons';
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

  render() {
    const { phone, country } = this.props.navigation.state.params

    return (
      <View style={styles.container}>
        <FadeInFromTop delay={500}>
          <Text h2 style={styles.title}>{Lang.t('welcome.phoneVerification.title')}</Text>
          <Text style={styles.description}>{Lang.t('welcome.phoneVerification.description', { phone: format({ phone, country }, 'International') })}</Text>
        </FadeInFromTop>
        <CodeVerificationInput ref={(c) => this._codeVerificationInput = c} disabled={this.state.checking} onFinish={(code) => this.checkCode(code)} />
        <Button
          title={Lang.t('welcome.phoneVerification.buttonLabel')}
          textStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
          buttonStyle={[styles.button, styles.buttonDisabled]}
          disabled
          loading={this.state.checking}
          loadingStyle={styles.loading}
        />
      </View>
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
  }
});
