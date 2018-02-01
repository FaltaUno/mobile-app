import { StackNavigator } from 'react-navigation';

import MatchListScreen from 'screens/MatchListScreen';
import AddMatchScreen from 'screens/AddMatchScreen';

const MatchListNavigator = StackNavigator(
  {
    MatchCreation: {
      screen: MatchListScreen
    },
    CreateMatch: {
      screen: AddMatchScreen
    }
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

export default MatchListNavigator
