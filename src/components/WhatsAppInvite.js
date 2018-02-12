import React from 'react';

import moment from 'moment'
import { format } from 'libphonenumber-js'

import { Linking, Alert, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements'

import Lang from 'lang'
import Colors from 'constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default class WhatsAppInvite extends React.Component {

  render() {
    return (
      <Button
        text={Lang.t(`whatsapp.buttonTitle`)}
        icon={<Ionicons name={'logo-whatsapp'} color={'white'} size={24}/>}
        iconRight
        buttonStyle={styles.button}
        style={styles.buttonContainer}
        onPress={() => this.sendNotification()}
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
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.whatsapp,
  },
  buttonContainer:{
    paddingLeft: 15,
    paddingRight: 15,
    width: '100%',
  }
})
