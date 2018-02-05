import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, SocialIcon } from 'react-native-elements';
import { Facebook } from 'expo';
import * as Firebase from 'firebase';

import Colors from 'constants/Colors';
import Config from 'config'
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
      toast = <View style={{ backgroundColor: Colors[this.state.toastState] }}>
        <Text style={(styles.toast)}>{this.state.toastMsg}</Text>
      </View>
    }

    const buttonProps = {
      title: Lang.t('login.loginWithFacebook'),
      disabled: this.state.isLogging
    }

    if (this.state.isLogging) {
      buttonProps.title = Lang.t('login.logging');
    }

    return (
      <View style={styles.flexible}>
        <View style={[styles.end, styles.imageContainer]}>
          <Image source={require('assets/images/icon.png')}></Image>
          <Text h1 style={styles.title}>{Lang.t('app.name')}</Text>
          <Text h4>{Lang.t('app.slogan')}</Text>
        </View>
        <View style={[styles.flexible, styles.end]}>
          <SocialIcon button type="facebook" onPress={this.login} {...buttonProps} />
        </View>
        <View style={[styles.flexible, styles.end]}>
          {toast}
        </View>
      </View>
    );
  }

  login = async () => {
    this.setState({ isLogging: true });
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
    if (type === 'success') {

      this.setState({
        toast: true,
        toastState: 'primary',
        toastMsg: Lang.t('login.success')
      });

      // Build Firebase credential with the Facebook access token.
      const credential = Firebase.auth.FacebookAuthProvider.credential(token);

      // Sign in with credential from the Facebook user.
      Firebase.auth().signInWithCredential(credential)
        .then(this._getUserData)
        .catch(() => {
          this.setState({
            isLogging: false,
            toast: true,
            toastState: 'danger',
            toastMsg: Lang.t('login.error.auth')
          });
        });
    } else if (type === 'cancel') {
      this.setState({
        isLogging: false,
        toast: true,
        toastState: 'danger',
        toastMsg: Lang.t('login.error.user_cancelled')
      });
    }
  }

  _getUserData(user) {
    const userRef = Firebase.database().ref(`users/${user.uid}`)
    return userRef.once('value', function (snapshot) {
      const exists = (snapshot.val() !== null);
      let newUserState = user.providerData[0]
      // If the user exists already
      if (exists) {
        // Merge the incoming data with the existent one
        newUserState = Object.assign({}, snapshot.val(), newUserState)
      }
      userRef.set(newUserState)
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
