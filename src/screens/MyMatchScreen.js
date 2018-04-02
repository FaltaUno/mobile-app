import React from "react";
import { Constants } from "expo";
import * as firebase from "firebase";
import moment from "moment";

import {
  ActivityIndicator,
  Platform,
  SectionList,
  Share,
  StyleSheet,
  View
} from "react-native";
import { ListItem, Text } from "react-native-elements";
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
    loading: true,
    users: {},
    loadingInvites: {},
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

    let reqs$ = [];
    Object.keys(invites).forEach(inviteKey => {
      // Get the invites
      const req$ = invitesRef
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
      reqs$.push(req$);
    });

    Promise.all(reqs$).then(() => this.setState({ loading: false }));
  }

  render() {
    //const { match } = this.props.navigation.state.params;
    if (this.state.loading) {
      return <ActivityIndicator size={`large`} />;
    }

    const pending = Object.values(this.state.pendingInvites);
    const approved = Object.values(this.state.approvedInvites);
    const rejected = Object.values(this.state.rejectedInvites);

    let invitesSections = [];
    if (pending.length) {
      invitesSections.push({
        title: Lang.t("myMatch.requestedInvitesLabel"),
        data: pending
      });
    }

    invitesSections.push({
      title: Lang.t("myMatch.approvedInvitesLabel"),
      data: approved.length
        ? approved
        : [{ key: null, title: Lang.t(`myMatch.noApprovedInvites`) }]
    });

    invitesSections.push({
      title: Lang.t("myMatch.rejectedInvitesLabel"),
      data: rejected.length
        ? rejected
        : [{ key: null, title: Lang.t(`myMatch.noRejectedInvites`) }]
    });

    return (
      <View style={styles.container}>
        <SectionList
          sections={invitesSections}
          ListHeaderComponent={this.handleListHeaderComponent}
          renderSectionHeader={this.handleRenderSectionHeader}
          keyExtractor={this.handleKeyExtractor}
          renderItem={({ item }) => this.handleRenderItem(item)}
        />
      </View>
    );
  }

  handleListHeaderComponent() {
    return (
      <View style={styles.headerSectionContainer}>
        <Text style={styles.headerSectionTitle}>
          {Lang.t(`myMatch.invitesLabel`).toUpperCase()}
        </Text>
      </View>
    );
  }

  handleKeyExtractor(item) {
    return item.key;
  }

  handleRenderSectionHeader({ section }) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    );
  }

  handleRenderItem(invite) {
    if (!invite.key) {
      return (
        <ListItem
          title={invite.title}
          titleStyle={styles.emptyInvitesTitle}
          hideChevron
        />
      );
    }
    return (
      <ListItem
        key={invite.key}
        roundAvatar
        title={invite.user.displayName}
        avatar={{ uri: invite.user.photoURL }}
        subtitle={moment(invite.createdAt).calendar()}
        rightIcon={this.showActionButtons(
          invite,
          invite.requestRead
            ? invite.approved ? "approvedInvites" : "rejectedInvites"
            : "pendingInvites"
        )}
      />
    );
  }

  showActionButtons(invite, inviteType) {
    if (this.state.loadingInvites[invite.key]) {
      return <ActivityIndicator />;
    }
    return (
      <View style={styles.actionsContainer}>
        {this.showRejectButton(invite, inviteType)}
        {this.showApproveButton(invite, inviteType)}
      </View>
    );
  }

  showRejectButton(invite, inviteType) {
    if (invite.requestRead && !invite.approved) {
      return (
        <Ionicons
          style={styles.actionButton}
          name={(Platform.OS === "ios" ? "ios" : "md") + "-close-circle"}
          size={32}
          color={Colors.danger}
        />
      );
    }

    return (
      <Ionicons
        style={styles.actionButton}
        name={(Platform.OS === "ios" ? "ios" : "md") + "-close-circle-outline"}
        size={32}
        color={Colors.danger}
        onPress={() => {
          this.handleRejectedInvite(invite, inviteType);
        }}
      />
    );
  }

  showApproveButton(invite, inviteType) {
    if (invite.approved) {
      return (
        <Ionicons
          style={styles.actionButton}
          name={(Platform.OS === "ios" ? "ios" : "md") + "-checkmark-circle"}
          size={32}
          color={Colors.primary}
        />
      );
    }

    return (
      <Ionicons
        style={styles.actionButton}
        name={
          (Platform.OS === "ios" ? "ios" : "md") + "-checkmark-circle-outline"
        }
        size={32}
        color={Colors.primary}
        onPress={() => {
          this.handleApprovedInvite(invite, inviteType);
        }}
      />
    );
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

  handleApprovedInvite(invite, inviteType) {
    invite.requestRead = true;
    invite.approved = true;
    this.handleUpdateInvite(invite, inviteType);
  }

  handleRejectedInvite(invite, inviteType) {
    invite.requestRead = true;
    invite.approved = false;
    this.handleUpdateInvite(invite, inviteType);
  }

  handleUpdateInvite(invite, inviteType) {
    const db = firebase.database();

    let loadingInvites = Object.assign({}, this.state.loadingInvites, {
      [invite.key]: true
    });
    this.setState({ loadingInvites });

    const { requestRead, approved } = invite;
    db
      .ref(`invites`)
      .child(invite.key)
      .update({ requestRead, approved })
      .then(() => {
        let invites = Object.assign({}, this.state[inviteType], {
          [invite.key]: invite
        });

        loadingInvites[invite.key] = false;

        this.setState({ [inviteType]: invites, loadingInvites });
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
  container: {
    backgroundColor: Colors.white
  },
  headerSectionContainer: {
    borderBottomColor: Colors.whiteTransparent,
    backgroundColor: Colors.background
  },
  headerSectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
    opacity: 0.8
  },
  sectionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteTransparent,
    backgroundColor: Colors.background
  },
  sectionTitle: {
    color: Colors.dark,
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    opacity: 0.8
  },
  emptyInvitesTitle: {
    color: Colors.muted
  },
  actionsContainer: {
    flexDirection: "row"
  },
  actionButton: {
    marginLeft: 15
  }
});
