import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-elements';
import { format } from 'libphonenumber-js'

import Lang from 'lang';

import { Ionicons } from '@expo/vector-icons';

export default class PhoneConfirmationScreen extends React.Component {
  static navigationOptions = () => ({
    title: Lang.t('welcome.phoneConfirmation.headerTitle')
  });

  countries = ['AR', 'UY']
  // Props
  //   country: 'AR',
  //   phone: '',
  //   valid: false,

  render() {
    const { phone, country } = this.props.navigation.state.params

    return (
      <View style={styles.container}>
        <Ionicons style={styles.icon} name={(Platform.OS === 'ios' ? 'ios-call-outline' : 'md-call')} size={96} />
        <Text h2 style={styles.title}>{Lang.t('welcome.phoneConfirmation.title')}</Text>
        <Text style={styles.description}>{Lang.t('welcome.phoneConfirmation.description', { phone: format({ phone, country } , 'International') })}</Text>
      </View>
    );
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
  }
});
