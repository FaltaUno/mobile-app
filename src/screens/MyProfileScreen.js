import React from 'react';

import { ActivityIndicator, Alert, StyleSheet, View, ScrollView, Text } from 'react-native';
import { List, ListItem, Slider } from 'react-native-elements';
import { Location, Permissions } from 'expo';
import { format } from 'libphonenumber-js'

import PlayerCard from 'components/PlayerCard';

import Lang from 'lang'
import Colors from 'constants/Colors';
import * as Firebase from 'firebase';
import moment from 'moment'

export default class MyProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: Lang.t('myProfile.title'),
    headerLeft: (
      <Text style={styles.headerButton} onPress={() => navigation.goBack()}>{Lang.t('action.close')}</Text>
    ),
  });

  // Avaiable countries. ISO code format
  countries = ['AR', 'UY']

  state = {
    loading: true,
    user: {
      phone: {
        // False means autodetect from location
        country: false,
        // It must be empty strings to work
        phone: ""
      },
      available: true,
      filterByDistance: true,
      distance: 15,
      locationPermission: false,
      location: {},
      position: {},
    },
    locationErrorMessage: null,
  }

  constructor(props) {
    super(props);
    this.userFb = Firebase.auth().currentUser;
    this.userRef = Firebase.database().ref(`users/${this.userFb.uid}`)
  }

  async componentWillMount() {
    this._listenUserRef();

    // Get the online user and merge it
    const onlineUser = await this._loadUserAsync();
    const user = Object.assign({}, this.state.user, onlineUser);
    this.userRef.child('available').set(user.available);
    this.userRef.child('filterByDistance').set(user.filterByDistance);
    this.userRef.child('distance').set(user.distance);

    // Get the location and position of the device and upate it online
    const { locationPermission, position, location } = await this._getLocationAsync();
    this.userRef.child('locationPermission').set(locationPermission);
    this.userRef.child('position').set(position);
    this.userRef.child('location').set(location);

    if (locationPermission && user.phone.country === false) {
      this.userRef.child('phone').set({
        country: location.isoCountryCode,
        phone: '',
      })
    }

    // We finished the load process
    this.setState({ loading: false });
  }

  _listenUserRef() {
    this.userRef.on('value', (snapshot) => {
      const user = Object.assign({}, this.state.user, snapshot.val())
      this.setState({ user })
    })
  }

  componentWillUnmount() {
    this.userRef.off('value');
  }

  render() {
    if (this.state.loading) {
      return <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    }

    const user = this.state.user

    return (
      <ScrollView>
        <PlayerCard player={user} />
        <List>
          <ListItem
            hideChevron
            title={Lang.t(`myProfile.email`)}
            rightTitle={user.email}
            rightTitleStyle={styles.infoText}
          />
          <ListItem
            hideChevron
            title={Lang.t(`myProfile.phoneNumber`)}
            rightTitle={format(user.phone, 'International')}
            rightTitleStyle={styles.infoText}
          />
          <ListItem
            hideChevron
            title={Lang.t(`myProfile.memberSince`)}
            rightTitle={moment(user.createdAt).fromNow()}
            rightTitleStyle={styles.infoText}
          />
        </List>
        <List>
          <ListItem
            title={Lang.t('myProfile.available')}
            hideChevron
            switchButton
            switched={user.available}
            onSwitch={() => this._updateUser({ available: !user.available })}
          />
          <ListItem
            hideChevron
            title={Lang.t('myProfile.myLocation')}
            rightTitle={this._getLocationText()}
            rightTitleStyle={styles.locationText}
          />
          <ListItem
            title={Lang.t('myProfile.filterByDistance')}
            disabled={!user.locationPermission}
            hideChevron
            switchButton
            switched={user.filterByDistance}
            onSwitch={() => this._updateUser({ filterByDistance: !user.filterByDistance })}
          />
          <ListItem
            disabled={!user.locationPermission || !user.filterByDistance}
            hideChevron
            subtitle={Lang.t('myProfile.distance', { distance: user.distance })}
            subtitleStyle={styles.sliderLabel}
            title={<Slider
              disabled={!user.locationPermission || !user.filterByDistance}
              minimumTrackTintColor={Colors.primaryLight}
              minimumValue={1}
              maximumValue={30}
              onValueChange={(distance) => this._updateUser({ distance })}
              step={1}
              thumbTintColor={Colors.primary}
              value={user.distance}
            />}
          />
        </List>
        <List containerStyle={styles.logoutContainer}>
          <ListItem
            title={Lang.t(`myProfile.logout`)}
            hideChevron
            titleStyle={styles.logout}
            containerStyle={styles.logoutWrapper}
            onPress={this._logOut}
          />
        </List>
      </ScrollView>
    )
  }

  _updateUser(userState) {
    const newUserState = Object.assign({}, this.state.user, userState)
    this.userRef.set(newUserState)
  }

  _logOut() {
    Firebase.auth().signOut().then(() => Alert.alert(Lang.t(`myProfile.logoutSuccess`)))
  }

  async _loadUserAsync() {
    // Get this data just one time and return the data (not the promise)
    return await this.userRef.once('value').then((snapshot) => snapshot.val())
  }

  async _getLocationAsync() {
    // Check for permission
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    // If not granted, show the message
    if (status !== 'granted') {
      return { locationPermission: false, position: {}, location: {} };
    }

    // Get the position and the reversegeolocation
    let position = await Location.getCurrentPositionAsync({});
    let locationCheck = await Location.reverseGeocodeAsync(position.coords);
    let location = locationCheck[0]

    return { locationPermission: true, position, location }
  }

  _getLocationText() {
    if (!this.state.user.locationPermission) {
      return Lang.t(`location.error.permissionDenied`);
    } else if (this.state.user.location) {
      const location = this.state.user.location
      return `${location.city}, ${location.country}`
    } else if (this.state.user.position) {
      const latlng = this.state.user.position.coords;
      const lat = latlng.latitude;
      const lng = latlng.longitude;
      return `${lat}, ${lng}`
    }

    return Lang.t('loading')
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  sliderLabel: {
    color: Colors.muted,
    fontSize: 14,
    alignSelf: 'center'
  },
  locationText: {
    color: Colors.muted
  },
  headerButton: {
    color: Colors.tintColor,
    fontSize: 16,
    marginLeft: 15,
    marginRight: 15,
  },
  infoText: {
    color: Colors.text
  },
  logoutContainer: {
    borderTopColor: Colors.danger,
    marginTop: 20,
  },
  logoutWrapper: {
    borderBottomColor: Colors.danger,
    paddingTop: 15,
    paddingBottom: 15,
  },
  logout: {
    color: Colors.danger,
    textAlign: 'center',
  },
})
