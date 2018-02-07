import React from 'react';
import { Alert, Image, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as Firebase from 'firebase';

import Colors from 'constants/Colors';
import Config from 'config'
import I18n from 'lang'

import RootNavigation from 'navigation/RootNavigation';
import LoginScreen from 'screens/LoginScreen';

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
    isLoadingComplete: false,
    loggedIn: false
  };

  constructor() {
    super();
    
    // Android timer warning message
    // TL;DR Ignore the warning
    // https://github.com/facebook/react-native/issues/12981#issuecomment-347227544

    // eslint-disable-next-line no-console
    console.ignoredYellowBox = ['Setting a timer'];
  }

  componentWillMount() {
    // Start firebase connection
    Firebase.initializeApp(Config.firebase);
  }

  render() {
    // While the assets are loading/caching...
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }
    // Once all it's loaded...
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
        {this.state.loggedIn ? <RootNavigation /> : <LoginScreen />}
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
    Firebase.auth().onAuthStateChanged((user) => {
      // Loading is totally completed,
      // trigger the login page or home based on user existence
      this.setState({
        isLoadingComplete: true,
        loggedIn: user != null
      });
    });

  };
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
