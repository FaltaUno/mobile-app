import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, Button, Icon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'libphonenumber-js';

import Lang from 'lang';
import Colors from '../constants/Colors'
import { Tour } from '../styles';

import PlainFadeIn from '../components/animations/PlainFadeIn';
import FadeInFromTop from '../components/animations/FadeInFromTop';

export default class PhoneConfirmationScreen extends React.Component {
  static navigationOptions = () => ({
    header: null
  });

  _goBack() { this.props.navigation.goBack() }

  render() {
    const { phone, country } = this.props.navigation.state.params

    return (
      <View style={styles.container}>
        <Button 
          icon={ <Icon name={(Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back')} size={20}
          type="ionicon" color={Colors.primary} /> }
          text={Lang.t(`welcome.phoneConfirmation.backText`)} clear={true} 
          textStyle={ { color: Colors.primary, fontSize: 20 } }
          containerStyle={ styles.backButtonContainer } onPress={ () => { this._goBack() } }
        />
        <FadeInFromTop delay={200}>
          <Text h2 style={styles.title}>{Lang.t('welcome.phoneConfirmation.title')}</Text>
        </FadeInFromTop>
        <FadeInFromTop delay={700}>
          <Text style={styles.description}>{Lang.t('welcome.phoneConfirmation.description', { phone: format({ phone, country }, 'International') })}</Text>
        </FadeInFromTop>
        <PlainFadeIn delay={1200}>
          <Button
            text={Lang.t('welcome.phoneConfirmation.buttonLabel')}
            textStyle={styles.buttonText}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            iconRight
            icon={<Ionicons name={(Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward')} color="white" size={18} />}
            onPress={() => this.props.navigation.navigate('LocationPermission', this.state) }
          />
        </PlainFadeIn>
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
