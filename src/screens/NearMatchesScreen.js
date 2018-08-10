import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  View,
  StyleSheet,
  Platform
} from "react-native";
import * as Firebase from "firebase";

import Colors from "constants/Colors";
import { headerStyle, headerIconButtonStyle } from "constants/Theme";
import Lang from "lang";
import { Ionicons } from "@expo/vector-icons";
import { Text, ListItem, List } from "react-native-elements";

import LocationService from "services/LocationService";
import UserService from "services/UserService";

export default class NearMatchesScreen extends React.Component {
  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => ({
    title: Lang.t("nearMatches.title"),
    ...headerStyle,
    headerRight: (
      <Ionicons
        name={Platform.OS === "ios" ? "ios-settings" : "md-settings"}
        style={headerIconButtonStyle}
        onPress={() => navigation.navigate("MyProfile")}
      />
    )
  });

  constructor(props) {
    super(props);
    /** WARNING: This will bring the whole matches, filtering in the app could be very expensive
     * we need to consider a strategy that brings the matches by near location: ie:
     * if I'm Lomas de Zamora player this can retrive Lomas, Banfield, Temperley matches as default.
     */
    this.matchesRef = Firebase.database().ref(`matches`);

    this.state = {
      loading: true,
      search: "",
      currentPosition: {},
      matches: {},
      displayMatches: [],
      currUser: {}
    };
  }

  componentDidMount() {
    // 1 - Get the user from firebase
    // 2 - Update the new position, location and locationPermission
    LocationService.getLocationAsync().then(({ position, location }) => {
      UserService.setMyLocation(position, location).then(me => {
        this.setState({ currUser: me });
        this._getNearMatches();
      });
    });
  }

  componentWillUnmount() {
    this.usersRef.off("value");
  }

  /**
   * Return the near matches.
   */
  _getNearMatches() {
    this.matchesRef.on("value", snapshot => {
      const matchesListObj = snapshot.val();
      if (matchesListObj) {
        const matchesList = Object.keys(matchesListObj).map(key =>
          Object.assign({}, matchesListObj[key], { key: key })
        );
        const displayMatches = this._filterLongDistanceMatches(matchesList);
        this.setState({ displayMatches: displayMatches });
      }
      this.setState({ loading: false });
    });
  }

  /**
   * Sets the matches that are in the locationg range allowed by the player configuration
   * distance.
   * 1 - It gets from the state the current user
   * 2 - Filter the matches list by distance
   *  2.1 - Calculates the match distance using the @type { LocationService }
   * @param matches a list of matches.
   *
   * @example:
   *  If the @property { Number } currUser.distance is 15 (km) it will set a list with the matches
   *  that are included in that value.
   *
   * @return the actual matches to display
   * */
  _filterLongDistanceMatches(matches) {
    const currUser = this.state.currUser;
    return matches.filter(match => {
      const matchDistance = parseInt(
        LocationService.calculateMatchDistance(currUser, match)
      );
      return matchDistance <= currUser.distance;
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      const matches = this.state.displayMatches;
      const currUser = this.state.currUser;

      if (matches.length !== 0) {
        return (
          <View style={styles.container}>
            <ScrollView>
              <List>
                {matches.map(match => {
                  if (currUser) {
                    const dist = parseInt(
                      LocationService.calculateMatchDistance(currUser, match)
                    );
                    return (
                      <ListItem
                        key={match.key}
                        title={match.name}
                        subtitle={
                          match.address.name +
                          "," +
                          match.address.city +
                          "," +
                          match.address.country
                        }
                        onPress={() =>
                          this.props.navigation.navigate("RequestMatchInvite", {
                            match
                          })
                        }
                      />
                    );
                  }
                })}
              </List>
            </ScrollView>
          </View>
        );
      }
      return (
        <View style={styles.emptyPlayersContainer}>
          <Text style={styles.emptyPlayers}>{Lang.t(`home.noPlayers`)}</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center"
  },
  container: {
    flex: 1
  },
  emptyPlayersContainer: {
    flex: 1,
    marginBottom: 60,
    justifyContent: "center"
  },
  emptyPlayers: {
    textAlign: "center",
    fontSize: 24,
    color: Colors.muted
  }
});
