import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'libphonenumber-js';

import Lang from 'lang';
import { Tour } from '../styles';

export default class PhoneConfirmationScreen extends React.Component {
  static navigationOptions = () => ({
    title: Lang.t('welcome.phoneConfirmation.headerTitle')
  });

  render() {
    const { phone, country } = this.props.navigation.state.params

    return (
      <View style={styles.container}>
        <Ionicons style={styles.icon} name={(Platform.OS === 'ios' ? 'ios-call-outline' : 'md-call')} size={96} />
        <Text h2 style={styles.title}>{Lang.t('welcome.phoneConfirmation.title')}</Text>
        <Text style={styles.description}>{Lang.t('welcome.phoneConfirmation.description', { phone: format({ phone, country }, 'International') })}</Text>
        <Button
          text={Lang.t('welcome.phoneConfirmation.buttonLabel')}
          textStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          iconRight
          icon={<Ionicons name={(Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward')} color="white" size={18} />}
          onPress={() => this.props.navigation.navigate('LocationPermission', this.state) }
        />
      </View>
    );
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
    padding: 20,
  },
});
