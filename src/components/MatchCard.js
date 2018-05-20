import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { Card } from "react-native-elements";
import { MapView } from "expo";

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
          <MapView
            style={styles.map}
            region={this.state.region}
            onRegionChange={region => this.setState({ region })}
          >
            {marker}
          </MapView>
          <Card title={theMatch.name} containerStyle={styles.container} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  }
});
