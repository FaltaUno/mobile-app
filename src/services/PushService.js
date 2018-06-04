import { Constants, Permissions, Notifications } from "expo";

import { NavigationActions } from "react-navigation";

import Config from "config";
import NavigationService from "./NavigationService";
import UserService from "./UserService";
import { getInviteRef } from "./InviteService";

class PushService {
  async registerForPushNotificationsAsync() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
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
    // For notification handling timing,
    // see https://docs.expo.io/versions/latest/guides/push-notifications#notification-handling-timing
    switch (origin) {
      // The app is in foreground
      case "received":
        break;

      // The app is in background and the user selected the push notification
      case "selected":
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
        break;
    }
  };

  updateNotificationsCount = () => {
    const inviteRef = getInviteRef();
    UserService.me().then(me => {
      // Get the user matches and count the unread requests for everyone of them
      let count = 0;
      let reqs$ = [];
      Object.keys(me.matches).map(matchKey => {
        reqs$.push(
          inviteRef
            .orderByChild(`matchKey`)
            .equalTo(matchKey)
            .once("value", snaps => {
              snaps.forEach(snap => {
                const invite = snap.val();
                if (!invite.requestRead) {
                  count++;
                }
              });
            })
        );
      });

      return Promise.all(reqs$).then(() => {
        Notifications.setBadgeNumberAsync(count)
      });
    });
  };

  //TODO: Localize when the app is detached
  notify = (user, data) => {
    const to = user.pushToken;
    return fetch(Config.push.uri, {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        to,
        ...data
      })
    });
  };
}

export default new PushService();
