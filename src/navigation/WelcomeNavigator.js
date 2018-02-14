import { StackNavigator } from 'react-navigation';

import HiScreen from 'screens/HiScreen';
import PhoneInputScreen from 'screens/PhoneInputScreen';
import PhoneVerificationScreen from 'screens/PhoneVerificationScreen';
import PhoneConfirmationScreen from 'screens/PhoneConfirmationScreen';
import LocationPermissionScreen from 'screens/LocationPermissionScreen';
import ConfigFinishScreen from 'screens/ConfigFinishScreen';

export default StackNavigator(
  {
    Hi: {
      screen: HiScreen
    },
    PhoneInput: {
      screen: PhoneInputScreen
    },
    PhoneVerification: {
      screen: PhoneVerificationScreen
    },
    PhoneConfirmation: {
      screen: PhoneConfirmationScreen
    },
    LocationPermission: {
      screen: LocationPermissionScreen
    },
    ConfigFinish: {
      screen: ConfigFinishScreen
    },
  },
  {
    initialRouteName: 'LocationPermission',
  }
);
