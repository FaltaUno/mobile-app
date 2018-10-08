import moment from "moment";
import { Share } from "react-native";

import Config from "config";
import Lang from "lang";
import FirebaseService from "./FirebaseService";
import UserService from "./UserService";
import { getInviteRef } from "./InviteService";
import PushService from "./PushService";

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
    const timestamp = FirebaseService.timestamp();
    const db = FirebaseService.db();

    // Invite
    const inviteKey = await getInviteRef().push().key;
    const invite = {
      createdAt: timestamp,
      matchKey: match.key,
      userKey: user.key,
      userEmail: user.email,
      userPhone: phone,
      requestRead: false,
      approved: false,
      approvalRead: false
    };

    // Invite relations
    const inviteRelation = { date: timestamp };

    let updates = {};
    updates[`invites/${inviteKey}`] = invite;
    updates[`matches/${match.key}/invites/${inviteKey}`] = inviteRelation;
    updates[`users/${user.key}/invites/${inviteKey}`] = inviteRelation;
    // User contact info
    updates[`users/${user.key}/contactInfo`] = { phone };

    db.ref().update(updates); // Async process

    // Send the push notification, no matters the response
    this.notifyInviteRequestToMatchCreator(matchCreator, match, user);
    return invite;
  }

  notifyInviteRequestToMatchCreator(matchCreator, match, user) {
    //this.getUnreadInviteRequestsCountForMatchAdmin(user.key).then(badge => {
      PushService.notify(matchCreator, {
        title: `${user.displayName} quiere jugar en ${match.name}`,
        body: `Ingresá para aceptarlo o rechazarlo`,
        badge: 1,
        data: {
          action: "myMatch.inviteRequest",
          matchKey: match.key,
          userKey: user.key
        }
      });
    //});
  }

  getUnreadInviteRequestsCountForMatchAdmin = userKey => {
    // Get the user matches and count the unread requests for everyone of them
    return UserService.readOnce(userKey).then(user => {
      let count = 0;
      let reqs$ = [];
      Object.keys(user.matches).map(matchKey => {
        reqs$.push(
          getInviteRef()
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
