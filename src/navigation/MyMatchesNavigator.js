import { StackNavigator } from 'react-navigation';

import MyMatchesScreen from 'screens/MyMatchesScreen';
import MyMatchScreen from 'screens/MyMatchScreen';
import MyMatchPlayersScreen from 'screens/MyMatchPlayersScreen';

export default StackNavigator(
  {
    MyMatches: {
      screen: MyMatchesScreen
    },
    MyMatch: {
      screen: MyMatchScreen
    },
    MyMatchPlayers: {
      screen: MyMatchPlayersScreen
    },
  },
  {
  }
);
