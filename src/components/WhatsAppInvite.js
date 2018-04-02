import React from 'react';

import moment from 'moment'
import { format } from 'libphonenumber-js'

import { Linking, Alert, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements'

import Lang from 'lang'
import Colors from 'constants/Colors';
import { Ionicons } from '@expo/vector-icons';

import MatchService from "services/MatchService";

export default class WhatsAppInvite extends React.Component {

  render() {
    return (
      <Button
        text={Lang.t(`whatsapp.buttonTitle`)}
        icon={<Ionicons name={'logo-whatsapp'} color={'white'} size={24}/>}
        iconRight
        style={styles.buttonRaw}
        buttonStyle={styles.button}
        containerStyle={styles.buttonContainer}
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

    const { message, url} = MatchService.getInvitationMessage(match)

    let whatsappUrl = this.buildWhatsAppUrl(phone, `${message}${url}`)
    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (!supported) {
        return Alert.alert(Lang.t(`whatsapp.urlNotSupported`, { url: whatsappUrl }));
      }
      return Linking.openURL(whatsappUrl);
    })
  }

  buildWhatsAppUrl(phone, text) {
    // https://faq.whatsapp.com/es/android/26000030/?category=5245251
    return `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.whatsapp,
    width: '100%'
  },
  buttonContainer:{
    marginLeft: 15,
    marginRight: 15,
  },
  buttonRaw:{
    width: '100%'
  }
})
