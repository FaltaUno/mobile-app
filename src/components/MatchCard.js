import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  View
} from "react-native";
import { Button, Card, Text, List, ListItem } from "react-native-elements";
import { MapView } from "expo";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

import Colors from "../constants/Colors";
import Lang from "lang";
import { Button as ButtonStyle } from "styles";

import UserService from "../services/UserService";
import MatchService from "../services/MatchService";

export default class MatchCard extends Component {
  state = {
    loading: true,
    marker: false,
    region: {},
    matchCreator: {
      displayName: <ActivityIndicator />
    }
  };

  async componentDidMount() {
    let marker = false;
    const match = this.props.match;

    UserService.readOnce(match.creatorKey).then(matchCreator => {
      this.setState({ matchCreator });
    });

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

      return (
        <View style={styles.container}>
          <List>
            <ListItem
              title={this.state.matchCreator.displayName}
              subtitle={Lang.t("matchCard.organizer")}
              hideChevron
            />
            <ListItem
              title={Lang.t("matchCard.remainingSpots", { spots: 1 })}
              hideChevron
            />
          </List>
          <List>
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
                    name={
                      Platform.OS === "ios" ? "ios-navigate" : "md-navigate"
                    }
                    size={32}
                    color={Colors.primary}
                    style={styles.actionButton}
                  />
                  <Ionicons
                    name={
                      (Platform.OS === "ios" ? "ios" : "md") + "-arrow-forward"
                    }
                    size={22}
                    color={Colors.muted}
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
          <Button
            text={Lang.t("matchCard.requestInvite")}
            textStyle={ButtonStyle.block.textStyle}
            containerStyle={[
              ButtonStyle.block.containerStyle,
              styles.buttonContainerStyle
            ]}
            buttonStyle={ButtonStyle.block.buttonStyle}
            onPress={this.handleRequestInvite}
          />
        </View>
      );
    }
  }

  handleRequestInvite = () => {
    UserService.me().then(me => {
      this.doRequestInvite(
        this.state.match,
        me,
        me.phone,
        this.state.matchCreator
      );
    });
  };

  async doRequestInvite(match, user, phone, matchCreator) {
    // Va ahora en el open dialog
    this.setState({ sendingInvite: true });
    await MatchService.requestInvite(match, user, phone, matchCreator);
    // const invites = this.state.invites.slice();
    //invites.push(invite);
    //this.setState({ sendingInvite: false, invites });
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
  container: {
    flex: 1
  },
  map: {
    flex: 1,
    borderColor: Colors.gray,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  actionButton: {
    marginLeft: 10,
    marginRight: 0
  },
  buttonContainerStyle: {
    marginTop: 0,
    marginBottom: 0
  }
});
