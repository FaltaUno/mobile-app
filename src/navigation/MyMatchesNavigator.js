import { StackNavigator } from 'react-navigation';

import MyMatchesScreen from 'screens/MyMatchesScreen';
import MyMatchScreen from 'screens/MyMatchScreen';

export default StackNavigator(
  {
    MyMatches: {
      screen: MyMatchesScreen
    },
    MyMatch: {
      screen: MyMatchScreen
    },
  },
  {
  }
);
