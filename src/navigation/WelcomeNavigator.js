import { StackNavigator } from 'react-navigation';

import HiScreen from 'screens/HiScreen';
import PhoneVerificationScreen from 'screens/PhoneVerificationScreen';
import PhoneConfirmationScreen from 'screens/PhoneConfirmationScreen';

export default StackNavigator(
  {
    Hi: {
      screen: HiScreen
    },
    PhoneVerification: {
      screen: PhoneVerificationScreen
    },
    PhoneConfirmation: {
      screen: PhoneConfirmationScreen
    },
  }
);
