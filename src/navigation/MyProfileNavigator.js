import { StackNavigator } from 'react-navigation';

import MyProfileScreen from 'screens/MyProfileScreen';

export default StackNavigator(
  {
    MyProfile: {
      screen: MyProfileScreen
    },
  },
);
