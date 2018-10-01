import React from "react";
import * as firebase from "firebase";
import moment from "moment";

import {
  ActivityIndicator,
  Platform,
  SectionList,
  StyleSheet,
  View
} from "react-native";
import { ListItem, Text } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

import Lang from "lang";
import Colors from "constants/Colors";
import { headerStyle, headerButtonStyle } from "constants/Theme";

import { getInvite } from "services/InviteService";
import MatchService from "services/MatchService";
import PushService from "../services/PushService";

export default class MyMatchPlayersScreen extends React.Component {
  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => {
    const { match } = navigation.state.params;

    let navigationOptions = {
      title: Lang.t("myMatch.invitesLabel"),
      ...headerStyle,
      headerRight: (
        <Text
          style={headerButtonStyle}
          onPress={() => MatchService.share(match)}
        >
          {Lang.t("myMatch.inviteAction")}
        </Text>
      )
    };

    return navigationOptions;
  };

  state = {
    loading: true,
    users: {},
    loadingInvites: {},
    inviteType: {},
    pendingInvites: {},
    approvedInvites: {},
    rejectedInvites: {}
  };

  componentDidMount() {
    const { navigation } = this.props;
    const { match } = navigation.state.params;
    const { invites = {} } = match;

    const db = firebase.database();
    const usersRef = db.ref(`users`);

    let reqs$ = [];
    Object.keys(invites).forEach(inviteKey => {
      // Get the invites
      const req$ = getInvite(inviteKey).then(invite => {
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
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size={`large`} />
        </View>
      );
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
      <SectionList
        sections={invitesSections}
        renderSectionHeader={this.handleRenderSectionHeader}
        keyExtractor={this.handleKeyExtractor}
        renderItem={({ item }) => this.handleRenderItem(item)}
      />
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
          containerStyle={styles.listItem}
          title={invite.title}
          titleStyle={styles.emptyInvitesTitle}
          hideChevron
        />
      );
    }
    return (
      <ListItem
        containerStyle={styles.listItem}
        key={invite.key}
        roundAvatar
        avatar={{ uri: invite.user.photoURL }}
        avatarStyle={
          !invite.requestRead || invite.approved
            ? null
            : styles.rejectedInviteAvatar
        }
        title={invite.user.displayName}
        titleStyle={
          !invite.requestRead || invite.approved
            ? null
            : styles.rejectedInviteTitle
        }
        subtitle={moment(invite.createdAt).calendar()}
        subtitleStyle={
          !invite.requestRead || invite.approved
            ? null
            : styles.rejectedInviteSubtitle
        }
        rightIcon={this.showActionButtons(
          invite,
          this.state.inviteType[invite.key]
        )}
      />
    );
  }

  showActionButtons(invite, inviteType) {
    // TODO: if approved, show email and phone/whatsapp icons to contact the user
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
    if (invite.requestRead && invite.approved) {
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
    let inviteType = Object.assign({}, this.state.inviteType);
    // Pending
    if (invite.requestRead === false) {
      let pendingInvites = Object.assign({}, this.state.pendingInvites, {
        [invite.key]: invite
      });
      inviteType[invite.key] = "pendingInvites";
      return this.setState({ pendingInvites, inviteType });
    }

    // Rejected
    if (invite.requestRead === true && invite.approved === false) {
      let rejectedInvites = Object.assign({}, this.state.rejectedInvites, {
        [invite.key]: invite
      });

      inviteType[invite.key] = "rejectedInvites";
      return this.setState({ rejectedInvites });
    }

    // Approved
    if (invite.requestRead === true && invite.approved === true) {
      let approvedInvites = Object.assign({}, this.state.approvedInvites, {
        [invite.key]: invite
      });

      inviteType[invite.key] = "approvedInvites";
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
    db.ref(`invites`)
      .child(invite.key)
      .update({ requestRead, approved })
      .then(() => {
        let invites = Object.assign({}, this.state[inviteType], {
          [invite.key]: invite
        });

        loadingInvites[invite.key] = false;

        this.setState({ [inviteType]: invites, loadingInvites });
        // Update the unread notifications
        PushService.updateNotificationsCount();
        this.triggerInvitesUpdate();
      });
  }

  triggerInvitesUpdate() {
    let pending = {};
    let approved = {};
    let rejected = {};

    const invites = Object.assign(
      {},
      this.state.pendingInvites,
      this.state.approvedInvites,
      this.state.rejectedInvites
    );

    Object.values(invites).forEach(invite => {
      if (!invite.requestRead) {
        pending[invite.key] = invite;
      } else {
        if (invite.approved) {
          approved[invite.key] = invite;
        } else {
          rejected[invite.key] = invite;
        }
      }
    });

    this.props.navigation.state.params.onInvitesUpdate({
      pending,
      approved,
      rejected
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  sectionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteTransparent
  },
  sectionTitle: {
    color: Colors.dark,
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 24,
    opacity: 0.8
  },
  listItem: {
    backgroundColor: Colors.white
  },
  emptyInvitesTitle: {
    color: Colors.muted
  },
  rejectedInviteAvatar: {
    opacity: 0.5
  },
  rejectedInviteTitle: {
    color: Colors.muted
  },
  rejectedInviteSubtitle: {
    color: Colors.gray
  },
  actionsContainer: {
    flexDirection: "row"
  },
  actionButton: {
    marginLeft: 10,
    marginRight: 10
  }
});
