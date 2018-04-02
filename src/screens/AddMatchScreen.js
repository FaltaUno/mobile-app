import React from "react";
import * as Firebase from "firebase";

// UI
import Colors from "constants/Colors";
import Lang from "lang";
import { ActivityIndicator, StyleSheet, Alert, View } from "react-native";
import { Text } from "react-native-elements";

// App
import MatchForm from "components/MatchForm";

export default class AddMatchScreen extends React.Component {
  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const { handleSave = () => {} } = params;
    let headerRight = (
      <Text style={styles.headerButton} onPress={handleSave}>
        {Lang.t("action.done")}
      </Text>
    );

    if (params.isSaving) {
      headerRight = (
        <ActivityIndicator style={styles.headerActivityIndicator} />
      );
    }

    return {
      title: Lang.t("addMatch.title"),
      headerLeft: (
        <Text
          style={styles.headerButton}
          onPress={() => navigation.dispatch({ type: "Navigation/BACK" })}
        >
          {Lang.t("action.close")}
        </Text>
      ),
      headerRight: headerRight
    };
  };

  state = {
    match: {
      name: null,
      playersNeeded: 1,
      place: null,
      locationFound: false,
      date: new Date()
    }
  };

  componentDidMount() {
    // We can only set the function after the component has been initialized
    const { params = {} } = this.props.navigation.state;
    this.props.navigation.setParams({ handleSave: this._handleSave });

    if (params.match) {
      this.setState({ match: params.match });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MatchForm
          match={this.state.match}
          onChange={match => this.setState({ match })}
          onPlacePress={match => {
            this.props.navigation.navigate("MatchLocation", {
              match,
              onLocationSave: (location, match) => this.setState({ match })
            });
          }}
        />
      </View>
    );
  }

  _handleSave = async () => {
    let match = Object.assign({}, this.state.match);

    if (!match.name) {
      return Alert.alert(Lang.t(`addMatch.noNameDefined`));
    }

    if (!match.playersNeeded) {
      return Alert.alert(Lang.t(`addMatch.noPlayersNeededDefined`));
    }

    if (!match.locationFound) {
      return Alert.alert(Lang.t(`addMatch.noLocationDefined`));
    }

    // Update state, show ActivityIndicator
    this.props.navigation.setParams({ isSaving: true });

    // Fb connection
    const uid = Firebase.auth().currentUser.uid;
    const db = Firebase.database();
    const matchesRef = db.ref().child("matches");

    // Get match data
    match.creatorKey = uid;

    // Match key detection/creation
    let key = match.key;
    if (!key) {
      key = matchesRef.push().key;
      match.createdAt = Firebase.database.ServerValue.TIMESTAMP;
    }
    delete match.key; // key is not saved as a field

    let updates = {};
    updates["/matches/" + key] = match;
    updates["/users/" + uid + "/matches/" + key] = { date: match.date };

    db
      .ref()
      .update(updates)
      .then(() => {
        const { onMatchUpdate } = this.props.navigation.state.params;
        if (onMatchUpdate) {
          return matchesRef.child(key).once("value", snap => {
            let match = snap.val();
            match.key = snap.key;
            onMatchUpdate(match);
          });
        }
      })
      .then(() => {
        this.props.navigation.setParams({ isSaving: false });
        this.props.navigation.dispatch({ type: "Navigation/BACK" });
      });
  };
}

const styles = StyleSheet.create({
  headerActivityIndicator: {
    marginLeft: 15,
    marginRight: 15
  },
  headerButton: {
    color: Colors.tintColor,
    fontSize: 16,
    marginLeft: 15,
    marginRight: 15
  },
  container: {
    flex: 1
  }
});
