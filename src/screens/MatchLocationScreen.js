import React from 'react';
import { MapView } from 'expo';
import { ActivityIndicator, StyleSheet, Text, View, Platform } from 'react-native';
import { Input } from 'react-native-elements';
import Lang from 'lang'

// UI
import Colors from 'constants/Colors';

// App
import UserService from 'services/UserService';
import LocationService from 'services/LocationService';
import { Ionicons } from '@expo/vector-icons';

export default class MatchLocationScreen extends React.Component {

  state = {
    loading: true,
    searching: false,
    match: {},
    region: {},
    marker: false,
  }

  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerRight = (
      <Text style={styles.headerButton} onPress={params.handleSave ? (params.handleSave) : () => null}>
        {Lang.t('action.done')}
      </Text>
    )

    if (params.isSaving) {
      headerRight = <ActivityIndicator style={styles.headerActivityIndicator} />;
    }

    return {
      title: Lang.t('addMatch.placeLabel'),
      headerBackTitle: params.match.name,
      headerRight: headerRight
    }
  }

  componentDidMount() {
    // We can only set the function after the component has been initialized
    let navigation = this.props.navigation;
    navigation.setParams({ handleSave: this._handleSave });
    const match = navigation.state.params.match
    let region = {
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }

    let marker = false
    if (match.location) {
      region.latitude = match.location.lat
      region.longitude = match.location.lng
      marker = {
        coordinate: {
          latitude: region.latitude,
          longitude: region.longitude,
        }
      }
    } else {
      UserService.me().then(me => {
        const coords = me.position.coords
        region.latitude = coords.latitude
        region.longitude = coords.longitude
      })
    }

    this.setState({
      loading: false,
      region,
      marker,
      match,
    })
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    let marker = null
    if (this.state.marker) {
      marker = (
        <MapView.Marker {...this.state.marker}
          draggable
          onDragEnd={(event) => this.parseMarkerPosition(event.nativeEvent.coordinate)} />
      )
    }

    //let inputIcon = (<Ionicons name={(Platform.OS === "ios" ? 'ios' : 'md') + '-search'} size={24} />)
    let inputIcon;
    if (this.state.searching) {
      inputIcon = (<ActivityIndicator size={`small`} />)
    }

    return (
      <View style={styles.container}>
        <View>
          <Input
            inputStyle={styles.input}
            containerStyle={styles.inputContainer}
            rightIconContainerStyle={styles.inputRightIcon}
            placeholder={Lang.t(`addMatch.addressLabel`)}
            value={this.state.match.place}
            rightIcon={inputIcon}
            returnKeyType={`search`}
            onChangeText={(place) => this.updatePlace(place)}
            onSubmitEditing={() => this.geocode(this.state.match.place)}
          />
        </View>
        <MapView
          style={styles.map}
          region={this.state.region}
          onRegionChange={() => this.onRegionChange}>
          {marker}
        </MapView>
      </View>
    )
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  geocode(address) {
    this.setState({ searching: true })
    LocationService.locationFromAddress(address).then((latlng) => {
      if (latlng) {
        let match = Object.assign({}, this.state.match)
        match.location = Object.assign({}, latlng)
        let marker = Object.assign({}, this.state.marker)
        marker.coordinate = {
          latitude: latlng.lat,
          longitude: latlng.lng
        }
        let region = Object.assign({}, this.state.region)
        region.latitude = latlng.lat
        region.longitude = latlng.lng
        this.setState({ match, marker, region, searching: false })
      }
    })
  }

  parseMarkerPosition(coordinate) {
    let marker = Object.assign({}, this.state.marker)
    marker.coordinate = coordinate
    this.setState({ marker })
    this.reverseGeocode(coordinate)
  }

  reverseGeocode(coordinate) {
    this.setState({ searching: true })
    let { latitude, longitude } = coordinate
    LocationService.reverseGeocode(latitude, longitude).then((address) => {
      const place = [address[0].name, address[0].city, address[0].region, address[0].country].join(', ')
      this.updatePlace(place)
      this.updateLocation(latitude, longitude)
      this.setState({ searching: false })
    })
  }

  updatePlace(place) {
    let match = Object.assign({}, this.state.match)
    match.place = place
    this.setState({ match })
  }

  updateLocation(latitude, longitude) {
    let match = Object.assign({}, this.state.match)
    match.location = { lat:latitude, lng: longitude }
    match.locationUrl = LocationService.makeLink({ latitude, longitude })

    this.setState({ match })
  }

  _handleSave = async () => {
  }

}

const styles = StyleSheet.create({
  headerButton: {
    color: Colors.tintColor,
    fontSize: 16,
    marginLeft: 15,
    marginRight: 15,
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  input: {
    fontSize: 16,
    color: Colors.dark,
    flex: 1,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: Colors.white,
  },
  inputRightIcon: {
    padding: 15,
  }
})
