import { format } from "libphonenumber-js";
import moment from "moment";

import { Linking, Alert } from "react-native";

import Lang from "lang";

class WhatsappService {
  contactAdminForMatch(creator, match, user) {
    // See: https://www.npmjs.com/package/libphonenumber-js#formatparsednumber-format-options
    let parsedPhone = format(creator.phone, "E.164");

    if (!parsedPhone) {
      return Alert.alert(
        Lang.t("invite.invalidPhoneNumberTitle"),
        Lang.t("invite.invalidPhoneNumber")
      );
    }
    let message = Lang.t(`whatsapp.contactAdminForMatch`, {
      userName: user.displayName,
      creatorName: creator.displayName,
      matchName: match.name,
      matchPlace: match.place,
      matchDate: moment(match.date)
        .calendar()
        .toLowerCase()
    });

    let whatsappUrl = this.buildWhatsAppUrl(parsedPhone, `${message}`);
    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (!supported) {
        return Alert.alert(
          Lang.t(`whatsapp.urlNotSupported`, { url: whatsappUrl })
        );
      }
      return Linking.openURL(whatsappUrl);
    });
  }

  buildWhatsAppUrl(phone, text) {
    // https://faq.whatsapp.com/es/android/26000030/?category=5245251
    return `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
  }
}

export default new WhatsappService();
