import { StackNavigator } from 'react-navigation';

import NearMatchesScreen from 'screens/NearMatchesScreen';

export default StackNavigator(
  {
    NearMatches: {
      screen: NearMatchesScreen
    }
  }
);
