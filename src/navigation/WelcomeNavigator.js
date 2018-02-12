import { StackNavigator } from 'react-navigation';

import HiScreen from 'screens/HiScreen';
import PhoneVerificationScreen from 'screens/PhoneVerificationScreen';

export default StackNavigator(
  {
    Hi: {
      screen: HiScreen
    },
    PhoneVerification: {
      screen: PhoneVerificationScreen
    },
  }
);
