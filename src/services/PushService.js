import { Constants, Permissions, Notifications } from "expo";

import { NavigationActions } from "react-navigation";

import NavigationService from "./NavigationService";
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
    // Alert.alert(
    //   `Push notification ${origin} with data: ${JSON.stringify(data)}`
    // );

    if (origin === "selected") {
      if (data.action === "myMatch.inviteRequest") {
        //const { matchKey } = data;
        // For navigating here I need the match data first, so...
        NavigationService.dispatch(
          NavigationActions.navigate({
            type: NavigationActions.NAVIGATE,
            routeName: "MyMatches"
          })
        );
      }
    }
  };
}

export default new PushService();
