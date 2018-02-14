import React from 'react';
import { Permissions, Location } from 'expo';
import { View, StyleSheet, Platform, Alert, Linking } from 'react-native';
import { Text, Button } from 'react-native-elements';

import Lang from 'lang';

import { Ionicons } from '@expo/vector-icons';
import UserService from 'services/UserService';

export default class LocationPermissionScreen extends React.Component {
  static navigationOptions = () => ({
    title: Lang.t('welcome.locationPermission.headerTitle')
  });

  state = {
    permissionDenied: false,
    asking: false
  }

  render() {
    return (
      <View style={styles.container}>
        <Ionicons style={styles.icon} name={(Platform.OS === 'ios' ? 'ios-map-outline' : 'md-map')} size={96} />
        <Text h2 style={styles.title}>{Lang.t('welcome.locationPermission.title')}</Text>
        <Text h4 style={styles.description}>{Lang.t('welcome.locationPermission.description')}</Text>
        <Text style={styles.detail}>{Lang.t('welcome.locationPermission.detail1')}</Text>
        <Text style={styles.detail}>{Lang.t('welcome.locationPermission.detail2')}</Text>
        <Button
          text={Lang.t(this.state.permissionDenied ? 'welcome.locationPermission.permissionDeniedButtonLabel' : 'welcome.locationPermission.buttonLabel')}
          textStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          disabled={this.state.asking}
          loading={this.state.asking}
          loadingStyle={styles.loading}
          onPress={() => this.state.permissionDenied ? Linking.openURL('app-settings:') : this.askForLocation()}
        />
      </View>
    );
  }

  async askForLocation() {
    this.setState({ asking: true })
    // Check for permission
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    // If not granted, show the message
    if (status !== 'granted') {
      Alert.alert(Lang.t(`welcome.locationPermission.permissionNotGranted`))
      return this.setState({ permissionDenied: true })
    }

    // Get the position and the reversegeolocation
    let position = await Location.getCurrentPositionAsync({});
    let locationCheck = await Location.reverseGeocodeAsync(position.coords);
    let location = locationCheck[0]

    UserService.setMyLocation(position, location)
    this.props.navigation.navigate('ConfigFinish')
    this.setState({ asking: false })
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
  },
  title: {
    marginTop: 20,
    textAlign: 'center'
  },
  description: {
    textAlign: 'center',
    fontSize: 20,
    padding: 20,
    paddingLeft: 0,
    paddingRight: 0,
  },
  detail: {
    textAlign: 'center',
    fontSize: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  button: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  buttonText: {
    width: '100%',
  },
  loading: {
    paddingTop: 9,
    paddingBottom: 9,
    width: '100%',
  },
});
