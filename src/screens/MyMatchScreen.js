import React from "react";
import * as firebase from "firebase";
import moment from "moment";

import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  View
} from "react-native";
import { ListItem, Text, List, Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

import Lang from "lang";
import Colors from "constants/Colors";
import MatchService from "services/MatchService";

export default class MyMatchScreen extends React.Component {
  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => {
    const { match, handleOnMatchUpdate = () => {} } = navigation.state.params;
    let myMatch = Object.assign({}, match);
    let navigationOptions = {
      title: match.name,
      headerRight: (
        <Text
          style={styles.headerButton}
          onPress={() =>
            navigation.navigate("AddMatch", {
              match: myMatch,
              onMatchUpdate: match => {
                // Update the local ref to the new match,
                // so when the user press "Edit" again
                // she sees the modified match
                myMatch = Object.assign({}, match);

                // Bubble the change to the parent screens
                handleOnMatchUpdate(match);
              }
            })
          }
        >
          {Lang.t("action.edit")}
        </Text>
      )
    };

    return navigationOptions;
  };

  state = {
    match: {},
    loadingInvites: true,
    invitesRequestCount: 0
  };

  componentDidMount() {
    const { navigation } = this.props;
    const { match } = navigation.state.params;

    this.setState({ match });
    const { invites = {} } = match;
    navigation.setParams({
      handleOnMatchUpdate: match => this.handleOnMatchUpdate(match)
    });

    const db = firebase.database();
    const invitesRef = db.ref(`invites`);
    let invitesRequestCount = 0;
    let invitesApprovedCount = 0;

    let reqs$ = [];
    Object.keys(invites).forEach(inviteKey => {
      // Get the invites
      const req$ = invitesRef
        .child(inviteKey)
        .once("value")
        .then(snap => {
          let invite = snap.val();
          if (!invite.requestRead) {
            invitesRequestCount++;
          }

          if (invite.requestRead && invite.approved) {
            invitesApprovedCount++;
          }
        });
      reqs$.push(req$);
    });

    Promise.all(reqs$).then(() =>
      this.setState({
        invitesRequestCount,
        invitesApprovedCount,
        loadingInvites: false
      })
    );
  }

  render() {
    const { navigation } = this.props;
    const { match } = this.state;
    let playersNeededItem = (
      <ListItem
        title={Lang.t("myMatch.loadingInvitesInfo")}
        titleStyle={styles.listItemLoading}
        rightIcon={<ActivityIndicator />}
      />
    );

    if (!this.state.loadingInvites) {
      const { playersNeeded = 0 } = match;

      if (!playersNeeded) {
        playersNeededItem = (
          <ListItem hideChevron title={Lang.t(`myMatch.noPlayersNeeded`)} />
        );
      } else {
        const { invitesApprovedCount, invitesRequestCount } = this.state;
        const invitesTitle = Lang.t(`myMatch.approvedPlayersOutOfTotal`, {
          approved: invitesApprovedCount,
          total: playersNeeded
        });
        const invitesBadge = invitesRequestCount
          ? { value: invitesRequestCount }
          : false;

        playersNeededItem = (
          <ListItem
            title={invitesTitle}
            badge={invitesBadge}
            onPress={() => {
              navigation.navigate("MyMatchPlayers", {
                match,
                onInvitesUpdate: ({ pending, approved }) => {
                  this.setState({
                    invitesApprovedCount: Object.values(approved).length,
                    invitesRequestCount: Object.values(pending).length
                  });
                }
              });
            }}
          />
        );
      }
    }
    return (
      <View style={styles.container}>
        <View>
          <List>{playersNeededItem}</List>
          <List>
            <ListItem hideChevron title={match.name} />
            <ListItem
              hideChevron
              title={Lang.t("addMatch.notesLabel")}
              subtitle={
                <Text style={styles.listItemMultiline}>
                  {match.notes ? match.notes : Lang.t(`myMatch.noNotes`)}
                </Text>
              }
            />
          </List>
          <List>
            <ListItem
              hideChevron
              title={Lang.t("addMatch.dateLabel")}
              rightTitle={moment(match.date).calendar()}
              rightTitleStyle={styles.listItemText}
            />
            <ListItem
              title={Lang.t("addMatch.placeLabel")}
              rightIcon={
                <View style={styles.actionsContainer}>
                  <Ionicons
                    name={Platform.OS === "ios" ? "ios-map-outline" : "md-map"}
                    size={32}
                    style={styles.actionButton}
                  />
                  <Ionicons
                    name={
                      (Platform.OS === "ios" ? "ios" : "md") + "-arrow-forward"
                    }
                    size={22}
                    color={Colors.text}
                    style={styles.actionButton}
                  />
                </View>
              }
              subtitle={match.place}
              subtitleStyle={styles.listItemSubtitle}
              onPress={() => this.handleMapOpen(match.location)}
            />
          </List>
        </View>
        <Button
          text={Lang.t(`match.inviteButtonText`)}
          buttonStyle={styles.button}
          style={styles.buttonContainer}
          backgroundColor={Colors.primary}
          onPress={() => MatchService.share(match)}
        />
      </View>
    );
  }

  handleOnMatchUpdate(match) {
    const { onMatchUpdate = () => {} } = this.props.navigation.state.params;
    this.setState({ match });
    onMatchUpdate(match);
  }

  handleMapOpen({ lat, lng }) {
    const mapUrl = `http://maps.apple.com/?q=${lat},${lng}`;
    Linking.canOpenURL(mapUrl).then(supported => {
      if (!supported) {
        return Alert.alert(Lang.t(`error.urlNotSupported`, { mapUrl }));
      }
      return Linking.openURL(mapUrl);
    });
  }
}

const styles = StyleSheet.create({
  headerButton: {
    color: Colors.tintColor,
    fontSize: 16,
    marginLeft: 15,
    marginRight: 15
  },
  container: {
    flex: 1,
    justifyContent: "space-between"
  },
  listItemLoading: {
    marginTop: 4,
    marginBottom: 4
  },
  listItemText: {
    color: Colors.text
  },
  listItemSubtitle: {
    marginTop: 5,
    fontWeight: "normal",
    color: Colors.text2
  },
  listItemMultiline: {
    color: Colors.text2,
    marginTop: 5,
    marginLeft: 10
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  actionButton: {
    marginLeft: 10,
    marginRight: 10
  },
  button: {
    borderRadius: 0,
    paddingTop: 5,
    paddingBottom: 5,
    width: "100%"
  },
  buttonContainer: {
    marginTop: 15,
    marginBottom: 15,
    width: "100%"
  }
});
