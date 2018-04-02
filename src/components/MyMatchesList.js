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
    matches: {}
  };

  constructor(props) {
    super(props);
    // Get user matches
    const uid = Firebase.auth().currentUser.uid;
    const db = Firebase.database();
    this.matchesRef = db.ref("matches");
    this.userMatchesRef = db.ref(`users/${uid}/matches`);
  }

  componentDidMount() {
    // Con "value" cubro:
    // - Agregado de partido
    // - Eliminacion de partido
    // - Reordenamiento de partido
    this.userMatchesRef.orderByChild("date").on("value", userMatchesSnap => {
      let matches$ = [];
      userMatchesSnap.forEach(userMatchSnap => {
        matches$.push(this.matchesRef.child(userMatchSnap.key).once("value"));
        // Desarmo el listener anterior para no sobrecargar
        this.matchesRef.child(userMatchSnap.key).off("child_changed");
        this.matchesRef.child(userMatchSnap.key).off("child_added");
        // - Al modificar el partido, actualizar la data del mismo
        this.matchesRef
          .child(userMatchSnap.key)
          .on("child_changed", snap => this.handleChildUpdated(snap));

        // - Si se genera un pedido de invitacion
        this.matchesRef
          .child(userMatchSnap.key)
          .on("child_added", snap => this.handleChildUpdated(snap));
      });
      Promise.all(matches$).then(matchesSnap => {
        let matches = {};
        // Fill the array and mark the load as finished
        matchesSnap.forEach(matchSnap => {
          let match = matchSnap.val();
          match.key = matchSnap.key; // ID de firebase
          matches[match.key] = match;
        });
        this.setState({ loading: false, matches: matches });

        this.props.onMatchesDidLoad(matches);
      });
    });
  }

  componentWillUnmount() {
    const { matches } = this.state;
    matches.forEach((match) => {
      this.matchesRef.child(match.key).off('child_changed')
      this.matchesRef.child(match.key).off('child_added')
    })
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

    return (
      <ScrollView>
        <List>
          {matches.map(match => (
            <ListItem
              key={match.key}
              title={match.name}
              subtitle={match.place}
              rightTitle={moment(match.date).calendar()}
              onPress={() => this.props.onPress(match)}
              leftIcon={leftIcon}
              leftIconOnPress={() => this.handleDeleteMatch(match)}
            />
          ))}
        </List>
      </ScrollView>
    );
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
