import { Constants, Permissions, Notifications } from "expo";

import { Alert } from "react-native";

import UserService from "./UserService";

class PushService {
  async registerForPushNotificationsAsync() {
    // Remote notifications do not work in simulators, only on device
    if (!Constants.isDevice) {
      return;
    }

    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    // Stop here if the user did not grant permissions
    if (status !== "granted") {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    // Save the push in the user data
    UserService.setPushToken(token);
  }

  handleNotification = ({ origin, data }) => {
    // Do something inside the app
    Alert.alert(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`
    );
  };
}

export default new PushService();
