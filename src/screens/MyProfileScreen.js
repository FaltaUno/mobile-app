import React from 'react';

import { ActivityIndicator, Alert, StyleSheet, View, ScrollView, Text } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { Location, Permissions } from 'expo';

import PlayerCard from 'components/PlayerCard';
import PlayerProfileForm from 'components/PlayerProfileForm';

import Lang from 'lang'
import Colors from 'constants/Colors';
import * as Firebase from 'firebase';

import LocationService from '../services/LocationService';

export default class MyProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: Lang.t('myProfile.title'),
    headerLeft: (
      <Text style={styles.headerButton} onPress={() => navigation.goBack()}>{Lang.t('action.close')}</Text>
    ),
  });

  state = {
    loading: true,
    alreadyLoaded: false,
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
    // Get the online user and merge it
    const onlineUser = await this._loadUserAsync();
    let user = Object.assign({}, this.state.user, onlineUser);
    this.userRef.child('available').set(user.available);
    this.userRef.child('filterByDistance').set(user.filterByDistance);
    this.userRef.child('distance').set(user.distance);

    // Get the location and position of the device and upate it online
    const { locationPermission, position, location } = await LocationService.getLocationAsync();
    user = Object.assign({}, user, { locationPermission, position, location });
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
    this.setState({ loading: false, user });
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
        <PlayerProfileForm player={user} onChange={(player) => this.updatePlayer(player)}/>
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

  updatePlayer(player){
    this.userRef.set(player);
  }

  _logOut() {
    Firebase.auth().signOut().then(() => Alert.alert(Lang.t(`myProfile.logoutSuccess`)))
  }

  // @todo: Welcome tour
  async _loadUserAsync() {
    // Get this data just one time and return the data (not the promise)
    return await this.userRef.once('value').then((snapshot) => snapshot.val())
  }
  
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerButton: {
    color: Colors.tintColor,
    fontSize: 16,
    marginLeft: 15,
    marginRight: 15,
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
