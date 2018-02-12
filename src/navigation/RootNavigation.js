import { Notifications } from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Alert } from 'react-native';

import registerForPushNotificationsAsync from 'api/registerForPushNotificationsAsync';

import AddMatchNavigator from 'navigation/AddMatchNavigator';
import MainTabNavigator from 'navigation/MainTabNavigator';
import MyProfileNavigator from 'navigation/MyProfileNavigator';
import WelcomeNavigator from 'navigation/WelcomeNavigator';

const RootStackNavigator = StackNavigator(
  {
    Welcome: {
      screen: WelcomeNavigator,
    },
    Main: {
      screen: MainTabNavigator,
    },
    MyProfile: {
      screen: MyProfileNavigator,
    },
    AddMatch: {
      screen: AddMatchNavigator,
    }
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
);

export default class RootNavigator extends React.Component {
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    return <RootStackNavigator />;
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({ origin, data }) => {
    Alert.alert(`Push notification ${origin} with data: ${JSON.stringify(data)}`);
  };
}
