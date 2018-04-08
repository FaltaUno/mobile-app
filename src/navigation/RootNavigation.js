import { Notifications } from "expo";
import React from "react";
import { StackNavigator } from "react-navigation";
import { StatusBar, StyleSheet, View } from "react-native";

import NavigationService from 'services/NavigationService';
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

class RootNavigator extends React.Component {
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <RootStackNavigator
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </View>
    );
  }

  _registerForPushNotifications() {
    PushService.registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(
      PushService.handleNotification
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});

export default RootNavigator;
