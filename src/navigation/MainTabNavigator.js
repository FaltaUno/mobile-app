import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TabNavigator, TabBarBottom } from "react-navigation";

import Lang from "lang";
import Colors from "constants/Colors";

import InvitePlayerNavigator from "navigation/InvitePlayerNavigator";
import MyMatchesNavigator from "navigation/MyMatchesNavigator";

const navigationResolver = ({ navigation }) => ({
  header: null,
  tabBarIcon: ({ focused }) => iconResolver(navigation, focused),
  tabBarLabel: () => labelResolver(navigation)
});

const iconResolver = (navigation, focused) => {
  const { routeName } = navigation.state;
  let iconName;
  switch (routeName) {
    case "Home":
      iconName =
        Platform.OS === "ios"
          ? `ios-people${focused ? "" : "-outline"}`
          : "md-people";
      break;
    case "MyMatches":
      iconName =
        Platform.OS === "ios"
          ? `ios-football${focused ? "" : "-outline"}`
          : "md-football";
      break;
  }
  return (
    <Ionicons
      name={iconName}
      size={28}
      style={styles.icon}
      color={focused ? Colors.dark : Colors.tabIconDefault}
    />
  );
};

const labelResolver = navigation => {
  const { routeName } = navigation.state;
  let labelTitle;
  switch (routeName) {
    case "Home":
      labelTitle = Lang.t("home.title");
      break;
    case "MyMatches":
      labelTitle = Lang.t("myMatches.title");
      break;
  }
  return labelTitle;
};

export default TabNavigator(
  {
    Home: {
      screen: InvitePlayerNavigator
    },
    MyMatches: {
      screen: MyMatchesNavigator
    }
  },
  {
    animationEnabled: false,
    navigationOptions: navigationResolver,
    swipeEnabled: false,
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",
    tabBarOptions: {
      activeTintColor: Colors.dark
    }
  }
);

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3
  }
});
