import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  View
} from "react-native";
import { Button, List, ListItem } from "react-native-elements";
import { MapView } from "expo";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import Lang from "lang";
import { Button as ButtonStyle } from "styles";

import Colors from "../constants/Colors";

import UserService from "../services/UserService";
import MatchService from "../services/MatchService";
import { getInvites } from "../services/InviteService";
import WhatsappService from "../services/WhatsappService";

export default class MatchCard extends Component {
  state = {
    loading: true,
    marker: false,
    region: {},
    matchCreator: {
      displayName: <ActivityIndicator />
    },
    requestingInvite: false,
    userInviteStatus: null,
    spots: 0
  };

  componentDidMount() {
    let marker = false;
    const { match } = this.props;

    this.loadMatchCreator(match);
    this.loadUserInviteStatus(match);

    let region = {
      latitude: match.location.lat,
      latitudeDelta: 0.0922,
      longitude: match.location.lng,
      longitudeDelta: 0.0421
    };

    marker = {
      coordinate: {
        latitude: region.latitude,
        longitude: region.longitude
      }
    };

    this.setState({
      loading: false,
      region,
      marker
    });
  }

  render() {
    const theMatch = this.props.match;
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      let marker = null;
      if (this.state.marker) {
        marker = (
          <MapView.Marker
            {...this.state.marker}
            draggable
            onDragEnd={event =>
              this.parseMarkerPosition(event.nativeEvent.coordinate)
            }
          />
        );
      }

      let bottomButton;
      const { userInviteStatus } = this.state;

      if (userInviteStatus === null) {
        bottomButton = (
          <Button
            text={Lang.t("matchCard.requestInvite")}
            loading={this.state.requestingInvite}
            disabled={this.state.requestingInvite}
            loadingStyle={ButtonStyle.block.loadingStyle}
            textStyle={ButtonStyle.block.textStyle}
            containerStyle={[
              ButtonStyle.block.containerStyle,
              styles.buttonContainerStyle
            ]}
            buttonStyle={ButtonStyle.block.buttonStyle}
            onPress={this.handleRequestInvite}
          />
        );
      } else if (userInviteStatus === false) {
        bottomButton = (
          <Button
            text={Lang.t("matchCard.requestInviteSent")}
            disabled={true}
            textStyle={ButtonStyle.block.textStyle}
            containerStyle={[
              ButtonStyle.block.containerStyle,
              styles.buttonContainerStyle
            ]}
            buttonStyle={ButtonStyle.block.buttonStyle}
          />
        );
      } else {
        bottomButton = (
          <Button
            text={Lang.t("matchCard.requestInviteApproved")}
            disabled={true}
            textStyle={ButtonStyle.block.textStyle}
            containerStyle={[
              ButtonStyle.block.containerStyle,
              styles.buttonContainerStyle
            ]}
            buttonStyle={ButtonStyle.block.buttonStyle}
          />
        );
      }

      return (
        <View style={styles.container}>
          <List>
            <ListItem
              title={this.state.matchCreator.displayName}
              subtitle={Lang.t("matchCard.organizer")}
              rightIcon={
                <View style={styles.actionsContainer}>
                  <Ionicons
                    name={"logo-whatsapp"}
                    size={28}
                    color={Colors.primary}
                    style={styles.actionButton}
                  />
                  <Ionicons
                    name={
                      (Platform.OS === "ios" ? "ios" : "md") + "-arrow-forward"
                    }
                    size={22}
                    color={Colors.gray}
                    style={styles.actionButton}
                  />
                </View>
              }
              hideChevron={userInviteStatus !== true}
              onPress={() =>
                this.handleWhatsappMessage(
                  userInviteStatus === true,
                  this.state.matchCreator,
                  theMatch
                )
              }
            />
            <ListItem
              title={Lang.t("matchCard.date")}
              rightTitle={moment(theMatch.date).fromNow()}
              hideChevron
            />
            <ListItem
              title={theMatch.place}
              subtitle={Lang.t(`matchCard.place`)}
              rightIcon={
                <View style={styles.actionsContainer}>
                  <Ionicons
                    name={Platform.OS === "ios" ? "ios-map-outline" : "md-map"}
                    size={28}
                    style={styles.actionButton}
                  />
                  <Ionicons
                    name={
                      (Platform.OS === "ios" ? "ios" : "md") + "-arrow-forward"
                    }
                    size={22}
                    color={Colors.gray}
                    style={styles.actionButton}
                  />
                </View>
              }
              onPress={() => this.handleMapOpen(theMatch.location)}
            />
          </List>
          <MapView style={styles.map} region={this.state.region}>
            {marker}
          </MapView>
          <List containerStyle={styles.listBottom}>
            <ListItem
              title={Lang.t("matchCard.remainingSpots", {
                spots: this.state.spots
              })}
              hideChevron
            />
          </List>
          {bottomButton}
        </View>
      );
    }
  }

  loadMatchCreator(match) {
    UserService.readOnce(match.creatorKey).then(matchCreator => {
      this.setState({ matchCreator });
    });
  }

  // Get the invites and look if the user has already sent an invite request
  loadUserInviteStatus(match) {
    const { invites = {} } = match;
    const invitesKeys = Object.keys(invites).map(inviteKey => inviteKey);
    UserService.me().then(me => {
      getInvites(invitesKeys).then(invites => {
        let userInviteStatus = null;
        for (let invite of invites) {
          if (invite.userKey === me.key) {
            userInviteStatus = invite.requestRead && invite.approved;
          }
        }
        const spots =
          match.playersNeeded -
          invites.filter(invite => invite.approved === true).length;

        this.setState({ spots, userInviteStatus });
      });
    });
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

  handleRequestInvite = () => {
    const { match } = this.props;
    const { matchCreator } = this.state;

    UserService.me()
      .then(me => {
        // Va ahora en el open dialog
        this.setState({ requestingInvite: true });
        return MatchService.requestInvite(match, me, me.phone, matchCreator);
      })
      .then(() => {
        this.setState({ requestingInvite: false, userInviteStatus: false });
      });
  };

  handleWhatsappMessage(enabled, creator, match) {
    if (!enabled) {
      return false;
    }
    UserService.me().then(me => {
      WhatsappService.contactAdminForMatch(creator, match, me);
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1,
    borderColor: Colors.gray,
    borderWidth: 1,
    marginTop: 15
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  actionButton: {
    marginLeft: 10,
    marginRight: 0
  },
  listBottom: { marginBottom: 15 },
  buttonContainerStyle: {
    marginTop: 0,
    marginBottom: 0
  },
  userIsInvitedText: {
    color: Colors.primary,
    fontSize: 20,
    textAlign: "center"
  }
});
