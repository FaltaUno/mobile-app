import { StackNavigator } from 'react-navigation';

import NearPlayersScreen from 'screens/NearPlayersScreen';
import SelectMatchScreen from 'screens/SelectMatchScreen';
import InviteScreen from 'screens/InviteScreen';

export default StackNavigator(
  {
    NearPlayers: {
      screen: NearPlayersScreen
    },
    SelectMatch: {
      screen: SelectMatchScreen,
    },
    Invite: {
      screen: InviteScreen,
    },
  }
);
