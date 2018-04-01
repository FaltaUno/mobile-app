import React from "react";
import * as firebase from "firebase";
import moment from "moment";

import { ScrollView, Share, StyleSheet, View } from "react-native";
import { List, ListItem, Text } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

import Lang from "lang";
import Colors from "constants/Colors";

export default class MyMatchScreen extends React.Component {
  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => {
    const { handleShare, match } = navigation.state.params;

    let navigationOptions = {
      title: match.name,
      headerRight: (
        <Ionicons
          name={"ios-share-outline"}
          color={Colors.tintColor}
          size={28}
          style={styles.headerButton}
          onPress={() => handleShare(match)}
        />
      )
    };

    return navigationOptions;
  };

  state = {
    invites: {},
    users: {}
  };

  componentDidMount() {
    const { navigation } = this.props;
    const { match } = navigation.state.params;
    const { invites = {} } = match;

    // We can only set the function after the component has been initialized
    this.props.navigation.setParams({ handleShare: this.handleShare });

    const db = firebase.database();
    const invitesRef = db.ref(`invites`);
    const usersRef = db.ref(`users`);
    Object.keys(invites).forEach(inviteKey => {
      // Get the invites
      invitesRef
        .child(inviteKey)
        .once("value")
        .then(snap => {
          let invite = snap.val();
          invite.key = snap.key;
          // Fill the user data
          usersRef
            .child(invite.userKey)
            .once("value")
            .then(snap => {
              invite.user = snap.val();
              invite.user.key = snap.key;
              let invites = Object.assign({}, this.state.invites, {
                [invite.key]: invite
              });
              this.setState({ invites });
            });
        });
    });
  }

  fillInvites(invitesSnap) {
    let invites = this.state.invites.slice();
    // Fill the array and mark the load as finished
    for (let inviteSnap of invitesSnap) {
      let invite = inviteSnap.val();
      invite.key = inviteSnap.key; // ID de firebase
      invites.push(invite);
    }
    this.setState({ invites });
  }

  render() {
    const { match } = this.props.navigation.state.params;
    const { invites } = this.state;
    const approved = Object.values(invites).filter(
      invite => invite.approved === true
    );
    const pending = Object.values(invites).filter(
      invite => invite.approved !== true
    );
    return (
      <ScrollView>
        <Text>{Lang.t("myMatch.invitesLabel")}</Text>
        <List>
          <ListItem
            title={Lang.t("myMatch.requestedInvitesLabel")}
            badge={{ value: pending.length }}
          />
        </List>
        <List>
          {approved.map(invite => (
            <ListItem
              key={invite.key}
              roundAvatar
              title={invite.user.displayName}
              avatar={{ uri: invite.user.photoURL }}
              subtitle={moment(invite.createdAt).calendar()}
              hideChevron
              switchButton
              switched={invite.approved}
            />
          ))}
        </List>
      </ScrollView>
    );
  }

  handleShare(match) {
    let now = moment();
    let matchDate = moment(match.date);
    let diff = now.diff(matchDate, "days");
    let matchDateOn = "";
    if (diff < -1 || 1 < diff) {
      matchDateOn = Lang.t(`match.on`) + " ";
    }

    const inviteText = Lang.t("match.invitationText", {
      appName: Lang.t("app.name"),
      matchDate: matchDate.calendar(),
      matchPlace: match.place,
      matchDateOn: matchDateOn
    });

    const inviteFooter = Lang.t("match.invitationFooter", {
      appName: Lang.t("app.name"),
      appSlogan: Lang.t("app.slogan"),
      appContactEmail: Lang.t("app.contactEmail")
    });

    const text = `${inviteText}\n\n----------\n${inviteFooter}\n\n`;

    Share.share(
      {
        title: Lang.t(`match.invitationTitle`),
        message: text,
        url: match.locationUrl
      },
      {
        dialogTitle: Lang.t(`match.invitationDialogTitle`)
      }
    );
  }
}

const styles = StyleSheet.create({
  headerButton: {
    marginLeft: 15,
    marginRight: 15
  },
  invitesLabel: {
    marginLeft: 10
  }
});
