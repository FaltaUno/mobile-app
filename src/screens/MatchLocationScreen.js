import React from 'react';
import { MapView } from 'expo';
import { ActivityIndicator, StyleSheet, Text, View, Platform } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Lang from 'lang'

// UI
import Colors from 'constants/Colors';

// App
import UserService from 'services/UserService';
import LocationService from 'services/LocationService';

export default class MatchLocationScreen extends React.Component {

  state = {
    loading: true,
    searching: false,
    match: {},
    region: {},
    marker: false,
  }

  geocodeTimeout = false

  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerRight = (
      <Text style={styles.headerButton} onPress={params.handleSave ? (params.handleSave) : () => null}>
        {Lang.t('action.done')}
      </Text>
    )

    return {
      title: Lang.t('addMatch.placeLabel'),
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

      this.setState({
        loading: false,
        region,
        marker,
        match,
      })
    } else {
      UserService.me().then(me => {
        const coords = me.position.coords
        region.latitude = coords.latitude
        region.longitude = coords.longitude

        marker = {
          coordinate: {
            latitude: region.latitude,
            longitude: region.longitude,
          }
        }

        this.setState({
          loading: false,
          region,
          marker,
          match,
        })

        this.parseMarkerPosition(marker.coordinate)
      })
    }
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

    return (
      <View style={styles.container}>
        <View>
          <SearchBar
            lightTheme
            platform={Platform.OS}
            placeholder={Lang.t(`addMatch.addressLabel`)}
            value={this.state.match.place}
            showLoading={this.state.searching}
            returnKeyType={`search`}
            onChangeText={(place) => this.updatePlace(place)}
            onSubmitEditing={() => this.geocode(this.state.match.place)}
          />
        </View>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          region={this.state.region}
          onLongPress={(event) => {
            this.parseMarkerPosition(event.nativeEvent.coordinate)
          }}>
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
      this.updateLocation(address[0], latitude, longitude)
      this.setState({ searching: false })
    })
  }

  updatePlace(place) {
    let match = Object.assign({}, this.state.match)
    match.place = place
    this.setState({ match })
  }

  updateLocation(address, latitude, longitude) {
    let match = Object.assign({}, this.state.match)

    match.address = address
    match.location = { lat: latitude, lng: longitude }
    match.locationUrl = LocationService.makeLink({ latitude, longitude })
    match.locationFound = true

    this.setState({ match })
  }

  _handleSave = async () => {
    const match = Object.assign({}, this.state.match)
    const { place, address, location, locationUrl, locationFound } = match
    this.props.navigation.state.params.onLocationSave({ place, address, location, locationUrl, locationFound }, match)
    this.props.navigation.dispatch({ type: 'Navigation/BACK' });
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
  searchBar:{
    color: Colors.dark,
    backgroundColor: Colors.lightGray,
  },
  searchBarContainer:{
    backgroundColor: Colors.light,
  },
})
