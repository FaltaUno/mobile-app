import moment from "moment";
import { Share } from "react-native";

import Config from "config";
import Lang from "lang";

class MatchService {
  share(match) {
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

    Share.share(
      {
        title: Lang.t(`match.invitationTitle`),
        message: inviteText,
        url: matchLink
      },
      {
        dialogTitle: Lang.t(`match.invitationDialogTitle`)
      }
    );
  }
}

export default new MatchService();
