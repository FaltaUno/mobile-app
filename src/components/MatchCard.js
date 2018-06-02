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

import Colors from "constants/Colors";
import Lang from "lang";
import { Button as ButtonStyle } from "styles";

export default class MatchCard extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    loading: true,
    marker: false,
    region: {}
  };

  componentDidMount() {
    let marker = false;
    const match = this.props.match;

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
          <Card
            title={theMatch.name.toUpperCase()}
            containerStyle={styles.cardContainer}
          >
            <Text>
              {Lang.t("matchCard.organizedBy", {
                organizer: "Nahuel Sotelo"
              })}
            </Text>
            <Text style={styles.matchDate}>
              {moment(theMatch.date).fromNow()}
            </Text>
            <Text h4>{Lang.t("matchCard.remainingSpots", { spots: 1 })}</Text>
            <Button
              text={Lang.t("matchCard.requestInvite")}
              textStyle={ButtonStyle.block.textStyle}
              containerStyle={ButtonStyle.block.containerStyle}
              buttonStyle={ButtonStyle.block.buttonStyle}
            />
          </Card>
          <List>
            <ListItem
              title={Lang.t(`matchCard.place`)}
              subtitle={theMatch.place}
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
        </View>
      );
    }
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
    flex: 1
  },
  cardContainer: {
    flex: 1
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  actionButton: {
    marginLeft: 10,
    marginRight: 0
  },
  matchDate: {
    color: Colors.muted
  }
});
