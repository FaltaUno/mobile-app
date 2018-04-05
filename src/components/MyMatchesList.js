import React from "react";

import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  Platform
} from "react-native";
import { List, ListItem, Text } from "react-native-elements";

import * as Firebase from "firebase";
import moment from "moment";

import Lang from "lang";
import Colors from "constants/Colors";

export default class MyMatchesList extends React.Component {
  static defaultProps = {
    deleteMode: false,
    onPress: () => {},
    onMatchDidUpdate: () => {},
    onMatchesDidLoad: () => {}
  };

  state = {
    loading: true,
    matches: {},
    matchInvitesRequestCount: {}
  };

  constructor(props) {
    super(props);
    // Get user matches
    const uid = Firebase.auth().currentUser.uid;
    const db = Firebase.database();
    this.matchesRef = db.ref("matches");
    this.userMatchesRef = db.ref(`users/${uid}/matches`);
    this.invitesRef = db.ref(`invites`);
  }

  componentDidMount() {
    // Con "value" cubro:
    // - Agregado de partido
    // - Eliminacion de partido
    // - Reordenamiento de partido
    this.userMatchesRef.orderByChild("date").on("value", userMatchesSnap => {
      let matches$ = [];
      // matches update array
      let matches = {};
      userMatchesSnap.forEach(userMatchSnap => {
        let matchKey = userMatchSnap.key;
        matches$.push(
          this.matchesRef
            .child(matchKey)
            .once("value")
            .then(snap => {
              // Fill the array and mark the load as finished
              let match = snap.val();
              match.key = snap.key; // ID de firebase
              matches[match.key] = match;
            })
        );
        // - Al modificar el partido, actualizar la data del mismo
        this.matchesRef.child(matchKey).off("child_changed");
        this.matchesRef
          .child(matchKey)
          .on("child_changed", snap => this.handleChildUpdated(snap));

        // - Si se genera un pedido de invitacion
        this.matchesRef
          .child(matchKey)
          .child("invites")
          .off("child_added");
        this.matchesRef
          .child(matchKey)
          .child("invites")
          .on("child_added", snap => this.handleInvite(matchKey, snap));
      });
      Promise.all(matches$).then(() => {
        this.setState({ loading: false, matches });
        this.props.onMatchesDidLoad(this.state.matches);
      });
    });
  }

  componentWillUnmount() {
    const { matches } = this.state;
    Object.values(matches).forEach(match => {
      this.matchesRef.child(match.key).off("child_changed");
      this.matchesRef
        .child(match.key)
        .child("invites")
        .off("child_added");

      const { invites = {} } = match;
      Object.keys(invites).forEach(inviteKey => {
        this.invitesRef.child(inviteKey).off("value");
      });
    });
    this.userMatchesRef.off("value");
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    let matches = Object.values(this.state.matches);
    if (matches.length == 0) {
      return (
        <View style={styles.emptyMacthesContainer}>
          <Text style={styles.emptyMatchesText}>
            {Lang.t(`matches.noAvailable`)}
          </Text>
        </View>
      );
    }

    let leftIcon;
    if (this.props.deleteMode) {
      leftIcon = {
        name: (Platform.OS === "ios" ? "ios" : "md") + "-close-circle",
        type: "ionicon",
        style: styles.leftIcon
      };
    }

    const { matchInvitesRequestCount = {} } = this.state;

    return (
      <ScrollView>
        <List>
          {matches.map(match => {
            let badge = null;
            if (matchInvitesRequestCount[match.key]) {
              const pendingRequests = Object.keys(
                matchInvitesRequestCount[match.key]
              ).length;
              if (pendingRequests > 0) {
                badge = { value: pendingRequests };
              }
            }
            return (
              <ListItem
                key={match.key}
                title={match.name}
                subtitle={moment(match.date).calendar()}
                badge={badge}
                onPress={() => this.props.onPress(match)}
                leftIcon={leftIcon}
                leftIconOnPress={() => this.handleDeleteMatch(match)}
              />
            );
          })}
        </List>
      </ScrollView>
    );
  }

  handleInvite(matchKey, snap) {
    const inviteKey = snap.key;
    let match = Object.assign({}, this.state.matches[matchKey]);
    let { invites = {} } = match;
    invites[inviteKey] = snap.val();

    const matches = Object.assign({}, this.state.matches, {
      [matchKey]: match
    });

    this.setState({ matches });
    // Get the invites
    this.invitesRef.child(inviteKey).off("value");
    this.invitesRef.child(inviteKey).on("value", snap => {
      // Only check if the invite is pending
      let matchInvitesRequestCount = Object.assign(
        {},
        this.state.matchInvitesRequestCount
      );

      if (!matchInvitesRequestCount[matchKey]) {
        matchInvitesRequestCount[matchKey] = {};
      }

      const invite = snap.val();
      if (invite.requestRead) {
        delete matchInvitesRequestCount[matchKey][inviteKey];
      } else {
        matchInvitesRequestCount[matchKey][inviteKey] = true;
      }

      this.setState({ matchInvitesRequestCount });
    });
  }

  handleChildUpdated(snap) {
    const matchKey = snap.ref.parent.key;
    let match = Object.assign({}, this.state.matches[matchKey]);
    match[snap.key] = snap.val();

    let matches = Object.assign({}, this.state.matches, {
      [matchKey]: match
    });
    this.setState({ matches });
    this.props.onMatchDidUpdate(matches, match);
  }

  /** This method encapsulates the process to delete a match from Firebase Realtime DB
   * @param match: Match to delete
   */
  handleDeleteMatch(match) {
    const uid = Firebase.auth().currentUser.uid;
    const db = Firebase.database();
    let updates = {};
    updates["/matches/" + match.key] = null;
    updates["/users/" + uid + "/matches/" + match.key] = null;
    db.ref().update(updates);
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center"
  },
  emptyMacthesContainer: {
    flex: 1,
    marginBottom: 60,
    justifyContent: "center"
  },
  emptyMatchesText: {
    textAlign: "center",
    fontSize: 24,
    color: Colors.muted
  },
  leftIcon: {
    color: Colors.danger,
    fontSize: 24,
    marginRight: 12
  }
});
