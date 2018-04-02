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

export default class MyFutureMatchesList extends React.Component {
  static defaultProps = {
    onPress: () => {},
    onMatchesDidLoad: () => {}
  };

  state = {
    loading: true,
    matches: {},
    matchInvitesApprovedCount: {}
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
    const fromNow = new Date().getTime();
    this.userMatchesRef
      .orderByChild("date")
      .startAt(fromNow)
      .once("value", userMatchesSnap => {
        let matches$ = [];
        const matches = userMatchesSnap.val();
        Object.keys(matches).forEach(matchKey => {
          matches$.push(
            this.matchesRef
              .child(matchKey)
              .once("value")
              .then(snap => {
                // Fill the array and mark the load as finished
                let match = snap.val();
                match.key = snap.key; // ID de firebase
                let matches = Object.assign({}, this.state.matches, {
                  [match.key]: match
                });
                this.setState({ matches });
              })
          );

          // - Si se genera un pedido de invitacion
          this.matchesRef
            .child(matchKey)
            .child("invites")
            .once("value", snap => {
              const invites = snap.val();
              if (invites) {
                Object.keys(invites).forEach(inviteKey => {
                  this.handleInvite(matchKey, inviteKey);
                });
              }
            });
        });
        Promise.all(matches$).then(() => {
          this.setState({ loading: false });
          this.props.onMatchesDidLoad(this.state.matches);
        });
      });
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

    const { matchInvitesApprovedCount = {} } = this.state;

    return (
      <ScrollView>
        <List>
          {matches.map(match => {
            let badge = null;
            let approvedRequests = 0;
            if (matchInvitesApprovedCount[match.key]) {
              approvedRequests = Object.keys(
                matchInvitesApprovedCount[match.key]
              ).length;
            }
            badge = { value: `${approvedRequests}/${match.playersNeeded}` };
            return (
              <ListItem
                key={match.key}
                title={match.name}
                subtitle={moment(match.date).calendar()}
                badge={badge}
                onPress={() => this.props.onPress(match)}
              />
            );
          })}
        </List>
      </ScrollView>
    );
  }

  handleInvite(matchKey, inviteKey) {
    // Get the invites
    this.invitesRef.child(inviteKey).once("value", snap => {
      // Only check if the invite is pending
      let matchInvitesApprovedCount = Object.assign(
        {},
        this.state.matchInvitesApprovedCount
      );

      if (!matchInvitesApprovedCount[matchKey]) {
        matchInvitesApprovedCount[matchKey] = {};
      }

      const invite = snap.val();
      if (invite.requestRead && invite.approved) {
        matchInvitesApprovedCount[matchKey][inviteKey] = true;
      } else {
        delete matchInvitesApprovedCount[matchKey][inviteKey];
      }

      this.setState({ matchInvitesApprovedCount });
    });
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
  }
});
