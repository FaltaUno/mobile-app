import { StackNavigator } from 'react-navigation';

import AddMatchScreen from 'screens/AddMatchScreen';
import MatchLocationScreen from 'screens/MatchLocationScreen';

export default StackNavigator(
  {
    AddMatch: {
      screen: AddMatchScreen
    },
    MatchLocation: {
      screen: MatchLocationScreen
    }
  },
);
