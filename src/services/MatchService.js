import moment from "moment";
import { Share } from "react-native";

import Config from "config";
import Lang from "lang";
import FirebaseService from "./FirebaseService";
import UserService from "./UserService";
import InviteService from "./InviteService";

let ref = null;

class MatchService {
  getRef = () => {
    if (!ref) {
      ref = FirebaseService.db().ref(`matches`);
    }
    return ref;
  };

  share(match) {
    const { title, message, url, dialogTitle } = this.getInvitationMessage(
      match
    );

    Share.share({ title, message, url }, { dialogTitle });
  }

  getMatch(key) {
    return this.getRef()
      .child(key)
      .once("value")
      .then(snap => FirebaseService.normalizeSnap(snap));
  }

  getInvitationMessage(match) {
    const now = moment();
    const matchDate = moment(match.date);
    const diff = now.diff(matchDate, "days");
    let matchDateOn = "";
    if (diff < -1 || 1 < diff) {
      matchDateOn = Lang.t(`match.on`) + " ";
    }

    const matchLink = `${Config.webapp.uri}/match/${match.key}`;

    const inviteText = Lang.t("match.invitationText", {
      matchDate: matchDate.calendar().toLowerCase(),
      matchPlace: match.place,
      matchDateOn,
      matchLink
    });

    return {
      title: Lang.t(`match.invitationTitle`),
      message: inviteText,
      url: matchLink,
      dialogTitle: Lang.t(`match.invitationDialogTitle`)
    };
  }

  // TODO: revisar
  async requestInvite(match, user, phone, matchCreator) {
    const ServerValue = FirebaseService.database.ServerValue;
    const db = FirebaseService.db();

    // Invite
    const inviteKey = await db.child(`invites`).push().key;
    const invite = {
      createdAt: ServerValue.TIMESTAMP,
      matchKey: match.key,
      userKey: user.key,
      userEmail: user.email,
      userPhone: phone,
      requestRead: false,
      approved: false,
      approvalRead: false
    };

    // Invite relations
    const inviteRelation = { date: ServerValue.TIMESTAMP };

    let updates = {};
    updates[`invites/${inviteKey}`] = invite;
    updates[`matches/${match.key}/invites/${inviteKey}`] = inviteRelation;
    updates[`users/${user.key}/invites/${inviteKey}`] = inviteRelation;
    // User contact info
    updates[`users/${user.key}/contactInfo`] = { phone };

    await db.update(updates);
    // Send the push notification, no matters the response
    this.notifyInviteRequestToMatchCreator(matchCreator, match, user);
    return invite;
  }

  notifyInviteRequestToMatchCreator(matchCreator, match, user) {
    return notify(matchCreator, {
      title: `${user.displayName} quiere jugar en ${match.name}`,
      body: `Ingresá para aceptarlo o rechazarlo`,
      data: {
        action: "myMatch.inviteRequest",
        matchKey: match.key,
        userKey: user.key
      }
    });
  }

  async notify(user, data) {
    data.to = user.pushToken;
    data.badge = await this.getUnreadInviteRequestsCountForMatchAdmin(user.key);
    return fetch(process.env.PUSH_URI, {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    });
  }

  getUnreadInviteRequestsCountForMatchAdmin = userKey => {
    // Get the user matches and count the unread requests for everyone of them
    return UserService.readOnce(userKey).then(user => {
      let count = 0;
      let reqs$ = [];
      Object.keys(user.matches).map(matchKey => {
        reqs$.push(
          InviteService.getInvitesRef()
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

      return Promise.all(reqs$).then(() => count);
    });
  };
}

export default new MatchService();
