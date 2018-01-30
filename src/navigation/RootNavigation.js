import { Notifications } from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Alert } from 'react-native';

import registerForPushNotificationsAsync from 'api/registerForPushNotificationsAsync';

import MainTabNavigator from 'navigation/MainTabNavigator';
import MatchSelectorNavigator from 'navigation/MatchSelectorNavigator';
import InviteScreen from 'screens/InviteScreen';
import AddMatchScreen from 'screens/AddMatchScreen';
import MyProfileScreen from 'screens/MyProfileScreen';

const RootStackNavigator = StackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
    },
    MatchSelector: {
      screen: MatchSelectorNavigator
    },
    Invite: {
      screen: InviteScreen
    },
    CreateMatch: {
      screen: AddMatchScreen
    },
    MyProfile: {
      screen: MyProfileScreen
    }
  },
  {
    navigationOptions: {
      headerBackTitle: null,
    },
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
