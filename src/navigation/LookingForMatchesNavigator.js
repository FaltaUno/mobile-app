import { StackNavigator } from 'react-navigation';

import NearMatchesScreen from 'screens/NearMatchesScreen';
import RequestMatchInviteScreen from '../screens/RequestMatchInviteScreen';

export default StackNavigator(
  {
    NearMatches: {
      screen: NearMatchesScreen
    },
    RequestMatchInvite: {
      screen: RequestMatchInviteScreen
    }
  }
);
