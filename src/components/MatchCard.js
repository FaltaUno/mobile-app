import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  View
} from "react-native";
import { Button, Card, Text, ListItem } from "react-native-elements";
import { MapView } from "expo";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

import Colors from "constants/Colors";
import Lang from "lang";

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
          <Card title={theMatch.name} containerStyle={styles.cardContainer}>
            <Text>Partido organizado por {theMatch.creatorKey}</Text>
            <Text>{moment(theMatch.date).fromNow()}</Text>
            <Text>Queda 1 lugar</Text>
            <Button text="¡Quiero jugar!" />
          </Card>
          <Card title={"Información del partido"} containerStyle={styles.cardContainer}>
            <ListItem
              title={theMatch.place}
              rightIcon={
                <View style={styles.actionsContainer}>
                  <Ionicons
                    name={
                      Platform.OS === "ios" ? "ios-navigate" : "md-navigate"
                    }
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
              onPress={() => this.handleMapOpen(theMatch.location)}
            />
          </Card>
          {/*<MapView
            style={styles.map}
            region={this.state.region}
          >
            {marker}
          </MapView>*/}
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
    flex: 2,
    marginTop: 10,
    marginBottom: 10
  },
  cardContainer: {
    flex: 1,
    marginTop: 15
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  actionButton: {
    marginLeft: 10,
    marginRight: 0
  }
});
