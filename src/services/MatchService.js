import moment from "moment";
import { Share } from "react-native";

import Config from "config";
import Lang from "lang";
import FirebaseService from "./FirebaseService";

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
}

export default new MatchService();
