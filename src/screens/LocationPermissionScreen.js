import React from 'react';
import { View, StyleSheet, Platform, Alert, Linking } from 'react-native';
import { Text, Button } from 'react-native-elements';

import Lang from 'lang';
import Colors from 'constants/Colors';

import { Ionicons } from '@expo/vector-icons';

import UserService from 'services/UserService';
import LocationService from 'services/LocationService';

export default class LocationPermissionScreen extends React.Component {
  static navigationOptions = () => ({
    title: Lang.t('welcome.locationPermission.headerTitle')
  });

  state = {
    permissionDenied: false,
    asking: false
  }

  render() {
    let goToSettingsButton;
    if (this.state.permissionDenied) {
      goToSettingsButton = (
        <Button
          text={Lang.t('welcome.locationPermission.goToSettingsButtonLabel')}
          textStyle={[styles.buttonText, styles.buttonGoToSettingsText]}
          containerStyle={styles.buttonContainer}
          buttonStyle={[styles.button, styles.buttonGoToSettingsContainer]}
          onPress={() => Linking.openURL('app-settings:')}
        />
      )
    }
    return (
      <View style={styles.container}>
        <Ionicons style={styles.icon} name={(Platform.OS === 'ios' ? 'ios-map-outline' : 'md-map')} size={96} />
        <Text h2 style={styles.title}>{Lang.t('welcome.locationPermission.title')}</Text>
        <Text h4 style={styles.description}>{Lang.t('welcome.locationPermission.description')}</Text>
        <Text style={styles.detail}>{Lang.t('welcome.locationPermission.detail1')}</Text>
        <Text style={styles.detail}>{Lang.t('welcome.locationPermission.detail2')}</Text>
        {goToSettingsButton}
        <Button
          text={Lang.t(this.state.permissionDenied ? 'welcome.locationPermission.permissionCheckButtonLabel' : 'welcome.locationPermission.buttonLabel')}
          textStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          disabled={this.state.asking}
          loading={this.state.asking}
          loadingStyle={styles.loading}
          onPress={() => this.askForLocation()}
        />
      </View>
    );
  }

  async askForLocation() {
    this.setState({ asking: true })

    let { locationServicesEnabled, locationPermission, position, location } = await LocationService.getLocationAsync()

    if (!locationServicesEnabled) {
      Alert.alert(Lang.t(`welcome.locationPermission.noLocationServicesEnabled`))
      return this.setState({ permissionDenied: true, asking: false })
    }

    // If not granted, show the message
    if (!locationPermission) {
      Alert.alert(Lang.t(`welcome.locationPermission.permissionNotGranted`))
      return this.setState({ permissionDenied: true, asking: false })
    }

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
    padding: 10,
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
  buttonGoToSettingsText: {
    color: Colors.text,
  },
  buttonGoToSettingsContainer: {
    backgroundColor: Colors.light,
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
