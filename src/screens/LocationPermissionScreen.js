import React from 'react';
import { View, StyleSheet, Platform, Alert, Linking } from 'react-native';
import { Text, Button, Icon } from 'react-native-elements';

import Lang from 'lang';
import Colors from 'constants/Colors';
import Tour from '../styles/Tour';

import { Ionicons } from '@expo/vector-icons';

import UserService from 'services/UserService';
import LocationService from 'services/LocationService';
import PlainFadeIn from '../components/animations/PlainFadeIn';
import FadeInFromTop from '../components/animations/FadeInFromTop';

export default class LocationPermissionScreen extends React.Component {
  static navigationOptions = () => ({
    header: null
  });

  state = {
    permissionDenied: false,
    asking: false
  }

  goBack() { this.props.navigation.goBack() }

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
        <Button 
          icon={ <Icon name={(Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back')} size={20}
          type="ionicon" color={Colors.primary} /> }
          title={Lang.t(`welcome.locationPermission.backText`)} clear={true} 
          titleStyle={ { color: Colors.primary, fontSize: 20 } }
          containerStyle={ styles.backButtonContainer } onPress={ () => { this._goBack() } }
        />
        <FadeInFromTop delay={200}>
         <Text h2 style={styles.title}>{Lang.t('welcome.locationPermission.title')}</Text>
          <Text h4 style={styles.description}>{Lang.t('welcome.locationPermission.description')}</Text>
        </FadeInFromTop>
        <FadeInFromTop delay={700}>
          <Text style={styles.detail}>{Lang.t('welcome.locationPermission.detail1')}</Text>
          <Text style={styles.detail}>{Lang.t('welcome.locationPermission.detail2')}</Text>
        </FadeInFromTop>
        {goToSettingsButton}
        <PlainFadeIn delay={1200}>
          <Button
            title={Lang.t(this.state.permissionDenied ? 'welcome.locationPermission.permissionCheckButtonLabel' : 'welcome.locationPermission.buttonLabel')}
            textStyle={styles.buttonText}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            disabled={this.state.asking}
            loading={this.state.asking}
            loadingStyle={styles.loading}
            onPress={() => this.askForLocation()}
          />
        </PlainFadeIn>
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
  ...Tour,
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
  buttonText: {
    width: '100%',
  },
  loading: {
    paddingTop: 9,
    paddingBottom: 9,
    width: '100%',
    borderRadius: 50
  },
  backButtonContainer: {
    /* This is used to move a single element to the left when a whole view is inside a flex display with 
      justifyContent: 'center' */
    marginRight: 'auto',
    paddingLeft: 10,
    position: 'absolute',
    top: 25
  },
  backButtonIcon: {
    color: Colors.light
  },
});
