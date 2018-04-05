import React from "react";
import * as Firebase from "firebase";

// UI
import {
  headerStyle,
  headerButtonStyle,
  headerActivityIndicatorStyle
} from "constants/Theme";
import Lang from "lang";
import { ActivityIndicator, StyleSheet, Alert, View } from "react-native";
import { Text } from "react-native-elements";

// App
import MatchForm from "components/MatchForm";

/** @classdesc This class represent a screen in the device which let the players.
 *  1 - Create a Match by tapping in the add button located in upper right corner
 *  2 - Edit a Match by tapping in the match that the want
 *  3 - Remove a match by tapping in the remove button located in the upper left corner.
 */

export default class AddMatchScreen extends React.Component {
  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const { handleSave = () => {} } = params;
    let headerRight = (
      <Text style={headerButtonStyle} onPress={handleSave}>
        {Lang.t("action.done")}
      </Text>
    );

    if (params.isSaving) {
      headerRight = <ActivityIndicator style={headerActivityIndicatorStyle} />;
    }

    return {
      title: Lang.t("addMatch.title"),
      ...headerStyle,
      headerLeft: (
        <Text
          style={headerButtonStyle}
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
  container: {
    flex: 1
  }
});
