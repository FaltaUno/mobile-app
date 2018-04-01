import React from "react";
import * as firebase from "firebase";
import moment from "moment";

import { Platform, ScrollView, Share, StyleSheet, View } from "react-native";
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
          name={(Platform.OS === "ios" ? "ios" : "md") + "-share-outline"}
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
    users: {},
    pendingInvites: {},
    approvedInvites: {},
    rejectedInvites: {}
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

              this.pushInvite(invite);
            });
        });
    });
  }

  render() {
    //const { match } = this.props.navigation.state.params;
    return (
      <ScrollView>
        <Text h4>{Lang.t("myMatch.requestedInvitesLabel")}</Text>
        <List>{this.showPendingPlayers()}</List>
        <Text h4>{Lang.t("myMatch.approvedInvitesLabel")}</Text>
        <List>{this.showApprovedPlayers()}</List>
        <Text h4>{Lang.t("myMatch.rejectedInvitesLabel")}</Text>
        <List>{this.showRejectedPlayers()}</List>
      </ScrollView>
    );
  }

  showPendingPlayers() {
    let pendingPlayers = (
      <ListItem title={Lang.t(`myMatch.noPendingInvites`)} hideChevron />
    );

    const { pendingInvites } = this.state;
    const invites = Object.values(pendingInvites);
    if (invites.length) {
      pendingPlayers = invites.map(invite => (
        <ListItem
          key={invite.key}
          roundAvatar
          title={invite.user.displayName}
          avatar={{ uri: invite.user.photoURL }}
          subtitle={moment(invite.createdAt).calendar()}
          rightIcon={
            <View style={styles.actionsContainer}>
              {invite.requestRead === false && invite.approved === false ? (
                <Ionicons
                  style={styles.actionButton}
                  name={
                    (Platform.OS === "ios" ? "ios" : "md") +
                    "-close-circle-outline"
                  }
                  size={32}
                  color={Colors.danger}
                  onPress={() => {
                    this.handlePendingToRejectedInvite(invite);
                  }}
                />
              ) : null}
              {invite.requestRead === true && invite.approved === false ? (
                <Ionicons
                  style={styles.actionButton}
                  name={
                    (Platform.OS === "ios" ? "ios" : "md") + "-close-circle"
                  }
                  size={32}
                  color={Colors.danger}
                />
              ) : null}
              {invite.requestRead === true && invite.approved === true ? (
                <Ionicons
                  style={styles.actionButton}
                  name={
                    (Platform.OS === "ios" ? "ios" : "md") + "-checkmark-circle"
                  }
                  size={32}
                  color={Colors.primary}
                />
              ) : (
                <Ionicons
                  style={styles.actionButton}
                  name={
                    (Platform.OS === "ios" ? "ios" : "md") +
                    "-checkmark-circle-outline"
                  }
                  size={32}
                  color={Colors.primary}
                  onPress={() => {
                    this.handlePendingToApprovedInvite(invite);
                  }}
                />
              )}
            </View>
          }
        />
      ));
    }

    return pendingPlayers;
  }

  showApprovedPlayers() {
    let approvedPlayers = (
      <ListItem title={Lang.t(`myMatch.noApprovedInvites`)} hideChevron />
    );
    const { approvedInvites } = this.state;
    const invites = Object.values(approvedInvites);
    if (invites.length) {
      approvedPlayers = invites.map(invite => (
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
      ));
    }

    return approvedPlayers;
  }

  showRejectedPlayers() {
    let rejectedPlayers = (
      <ListItem title={Lang.t(`myMatch.noRejectedInvites`)} hideChevron />
    );

    const { rejectedInvites } = this.state;
    const invites = Object.values(rejectedInvites);
    if (invites.length) {
      rejectedPlayers = invites.map(invite => (
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
      ));
    }

    return rejectedPlayers;
  }

  pushInvite(invite) {
    // Pending
    if (invite.requestRead === false) {
      let pendingInvites = Object.assign({}, this.state.pendingInvites, {
        [invite.key]: invite
      });

      return this.setState({ pendingInvites });
    }

    // Rejected
    if (invite.requestRead === true && invite.approved === false) {
      let rejectedInvites = Object.assign({}, this.state.rejectedInvites, {
        [invite.key]: invite
      });

      return this.setState({ rejectedInvites });
    }

    // Approved
    if (invite.requestRead === true && invite.approved === true) {
      let approvedInvites = Object.assign({}, this.state.approvedInvites, {
        [invite.key]: invite
      });

      return this.setState({ approvedInvites });
    }
  }

  handlePendingToRejectedInvite(invite) {
    const db = firebase.database();
    db
      .ref(`invites`)
      .child(invite.key)
      .update({ requestRead: true, approved: false })
      .then(() => {
        invite.requestRead = true;
        invite.approved = false;

        let pendingInvites = Object.assign({}, this.state.pendingInvites, {
          [invite.key]: invite
        });

        this.setState({ pendingInvites });
      });
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
  actionsContainer: {
    flexDirection: "row"
  },
  actionButton: {
    marginLeft: 15
  }
});
