import React from 'react';

import moment from 'moment'
import { format } from 'libphonenumber-js'

import { Linking, Alert } from 'react-native';
import { Button } from 'react-native-elements'

import Lang from 'lang'
import Colors from 'constants/Colors';

export default class WhatsAppInvite extends React.Component {

  render() {
    return (
      <Button
        small
        iconRight={{ name: 'logo-whatsapp', type: 'ionicon' }}
        onPress={() => this.sendNotification()}
        backgroundColor={Colors.whatsapp}
        title={Lang.t(`whatsapp.buttonTitle`)}
        accessibilityLabel={Lang.t(`whatsapp.buttonTitle`)}
      />
    )
  }

  sendNotification() {
    const player = this.props.player
    const match = this.props.match

    // See: https://www.npmjs.com/package/libphonenumber-js#formatparsednumber-format-options
    let phone = format(player.phone, 'E.164')

    if (!phone) {
      return Alert.alert(
        Lang.t("invite.invalidPhoneNumberTitle"),
        Lang.t("invite.invalidPhoneNumber"),
      )
    }

    const inviteText = Lang.t('invite.invitationText', {
      appName: Lang.t('app.name'),
      playerName: player.displayName,
      matchDate: moment(match.date).calendar(),
      matchPlace: match.place,
      matchLocationInfo : ! match.locationFound ? null : Lang.t('invite.invitationLocationText', { locationUrl: match.locationUrl })
    });

    const inviteFooter = Lang.t('invite.invitationFooter', {
      appName: Lang.t('app.name'),
      appSlogan: Lang.t('app.slogan'),
      appContactEmail: Lang.t('app.contactEmail'),
    })

    const text = `${inviteText}\n\n----------\n${inviteFooter}`

    let url = this.buildWhatsAppUrl(phone, text)
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        return Alert.alert(Lang.t(`whatsapp.urlNotSupported`, { url }));
      }
      return Linking.openURL(url);
    })
  }

  buildWhatsAppUrl(phone, text) {
    // https://faq.whatsapp.com/es/android/26000030/?category=5245251
    return `https://api.whatsapp.com/send?text=${text}&phone=${phone}`;
  }

  // const buildText = (playerName, date, place, mapUrl) => {

  //   const dateFromNow = moment().calendar(date) + ' hs.';
  //   //TODO fetch from Lang
  //   return `Hola soy ${playerName} y te invito a un doparti el ${dateFromNow}, en ${place}
  // -------
  // Mensaje enviado desde Falta Uno App
  // <Pedí tu acceso de prueba $contacto>`
  // }
}
