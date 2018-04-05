import { Notifications } from "expo";
import React from "react";
import { StackNavigator } from "react-navigation";
import { StatusBar, StyleSheet, View } from "react-native";

import PushService from "services/PushService";

import AddMatchNavigator from "navigation/AddMatchNavigator";
import MainTabNavigator from "navigation/MainTabNavigator";
import MyProfileNavigator from "navigation/MyProfileNavigator";
import WelcomeNavigator from "navigation/WelcomeNavigator";

const RootStackNavigator = StackNavigator(
  {
    Main: {
      screen: MainTabNavigator
    },
    MyProfile: {
      screen: MyProfileNavigator
    },
    Welcome: {
      screen: WelcomeNavigator
    },
    AddMatch: {
      screen: AddMatchNavigator
    }
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

class RootNavigatorContent extends React.Component {
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
    PushService.registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(
      PushService.handleNotification
    );
  }
}

const RootNavigator = () => (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" />
    <RootNavigatorContent />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 }
});

export default RootNavigator;
