import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from 'constants/Colors';

import MatchListScreen from '../screens/MatchListScreen';
import NearPlayerScreen from '../screens/NearPlayersScreen';
import AddMatchScreen from '../screens/AddMatchScreen';


const navigationResolver = ({ navigation }) => ({
  tabBarIcon: ({ focused }) => iconResolver(navigation, focused)
})

const iconResolver = (navigation, focused) => {
  const { routeName } = navigation.state;
  let iconName;
  switch (routeName) {
    case 'Matches':
      iconName =
        Platform.OS === 'ios' ? `ios-football${focused ? '' : '-outline'}` : 'md-football';
      break;
    case 'NearPlayers':
      iconName =
        Platform.OS === 'ios'
          ? `ios-home${focused ? '' : '-outline'}`
          : 'md-home';
      break;
  }
  return (
    <Ionicons
      name={iconName}
      size={28}
      style={styles.icon}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}

export default TabNavigator(
  {
    NearPlayers: {
      screen: NearPlayerScreen,
    },
    Matches: {
      screen: MatchListScreen,
    }
  },
  {
    initialRouteName: 'NearPlayers',
    navigationOptions: navigationResolver,
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3
  }
})
