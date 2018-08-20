import React from 'react';
import { Alert, Image, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import Colors from 'constants/Colors';
import I18n from 'lang'

import FirebaseService from 'services/FirebaseService';
import FacebookAuthService from 'services/auth/FacebookAuthService';
import GoogleAuthService from 'services/auth/GoogleAuthService'

import LoginScreen from 'screens/LoginScreen';
import WelcomeNavigator from 'navigation/WelcomeNavigator';
import RootNavigation from 'navigation/RootNavigation';

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default class App extends React.Component {
  state = {
    loaded: false,
    screen: 'login',
  };

  constructor() {
    super();

    // Android timer warning message
    // TL;DR Ignore the warning
    // https://github.com/facebook/react-native/issues/12981#issuecomment-347227544

    // eslint-disable-next-line no-console
    console.ignoredYellowBox = ['Setting a timer'];

    // Start firebase connection
    FirebaseService.init();
  }

  render() {
    // While the assets are loading/caching...
    if (!this.state.loaded && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }

    let navigationScreen;
    switch (this.state.screen) {
      case 'main':
        navigationScreen = <RootNavigation />
        break;
      case 'welcome':
        navigationScreen = <WelcomeNavigator />
        break
      default:
        navigationScreen = <LoginScreen />
    }

    // Once all it's loaded...
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
        {navigationScreen}
      </View>
    );
  }

  _loadResourcesAsync = async () => {
    // Fonts
    const fontAssets = cacheFonts([
      { ...Ionicons.font },
      { ...FontAwesome.font }
    ]);

    // Images cache
    const imageAssets = cacheImages([
      require('assets/images/robot-dev.png'),
      require('assets/images/robot-prod.png'),
      require('assets/images/icon.png'),
    ]);

    // I18n
    const langAssets = I18n.initAsync().then(() => {
      const locale = I18n.locale.split('-')[0];
      switch (locale) {
        case 'es':
          require('moment/locale/es');
          break;
        default:
      }
    })

    return Promise.all([
      ...fontAssets,
      ...imageAssets,
      ...langAssets,
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    Alert.alert(error);
  };

  _handleFinishLoading = () => {
    // Check authentication
    //let provider = FirebaseService.providerId();
    //console.log("Provider is " + provider)
    //let authService = providerId === 'facebook.com' ? FacebookAuthService : GoogleAuthService;
    return FacebookAuthService.onAuthStateChanged((isRegistered, firstTime = true) => {
      // Loading is totally completed,
      let screen = 'login'
      if(isRegistered){
        screen = 'main'
      }
      if(firstTime){
        screen = 'welcome'
      }

      this.setState({ screen, loaded: true })
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: Colors.whiteTransparent,
  },
});
