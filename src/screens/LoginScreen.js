import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, SocialIcon } from 'react-native-elements';
import * as Firebase from 'firebase';

import AuthService from 'services/AuthService'

import Colors from 'constants/Colors';
import Lang from 'lang'

export default class LoginScreen extends React.Component {
  state = {
    isLogging: false,
    toast: false,
    toastState: null,
    toastMsg: null,
  }

  render() {

    let toast;
    if (this.state.toast) {
      toast = (
        <View style={{ backgroundColor: Colors[this.state.toastState] }}>
          <Text style={(styles.toast)}>{this.state.toastMsg}</Text>
        </View>
      )
    }

    return (
      <View style={styles.flexible}>
        <View style={[styles.end, styles.imageContainer]}>
          <Image source={require('assets/images/icon.png')}></Image>
          <Text h1 style={styles.title}>{Lang.t('app.name')}</Text>
          <Text h4>{Lang.t('app.slogan')}</Text>
        </View>
        <View style={[styles.flexible, styles.end]}>
          <SocialIcon button type="facebook" title={this.state.isLogging ? Lang.t('login.logging') : Lang.t('login.loginWithFacebook')} disabled={this.state.isLogging} onPress={this.login} />
        </View>
        <View style={[styles.flexible, styles.end]}>
          {toast}
        </View>
      </View>
    );
  }

  login = async () => {
    this.setState({ isLogging: true });
    const loggedIn = await AuthService.logIn();

    // Popup login window
    if (!loggedIn) {
      this.setState({
        isLogging: false,
        toast: true,
        toastState: 'danger',
        toastMsg: Lang.t('login.error.user_cancelled')
      });
      return
    }

    // Once the user finishes the input
    this.setState({
      toast: true,
      toastState: 'primary',
      toastMsg: Lang.t('login.success')
    });

    // Sign in with credential from the Facebook user.
    AuthService.signIn().catch(() => {
      this.setState({
        isLogging: false,
        toast: true,
        toastState: 'danger',
        toastMsg: Lang.t('login.error.auth')
      });
    });
  }
}

const styles = StyleSheet.create({
  flexible: {
    flex: 1
  },
  title: {
    marginTop: 20
  },
  imageContainer: {
    flex: 4,
    alignItems: 'center',
  },
  end: {
    justifyContent: 'flex-end'
  },
  toast: {
    color: Colors.light,
    margin: 10,
    textAlign: 'center'
  }
});
