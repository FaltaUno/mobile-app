import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
import { Text, Button, List, ListItem, Icon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { isValidNumber } from 'libphonenumber-js'

import Colors from 'constants/Colors';
import Lang from 'lang';
import { Tour } from 'styles';

import UserService from 'services/UserService';

// eslint-disable-next-line import/extensions, import/no-unresolved
import ListItemPicker from '../components/ListItemPicker';
import FadeInFromRight from '../components/animations/FadeInFromRight';
import FadeInFromLeft from '../components/animations/FadeInFromLeft';
import FadeInFromTop from '../components/animations/FadeInFromTop';

export default class PhoneInputScreen extends React.Component {
  static navigationOptions = () => ({
    header: null
  });

  countries = ['AR', 'UY']

  state = {
    country: 'AR',
    phone: '',
    valid: false,
  }

  constructor(props) {
    super(props)

    const langParts = Lang.locale.split('-')
    const country = langParts[1]

    // If the device country is in the array, then choose it
    if (this.countries.indexOf(country) > -1) {
      this.state.country = country
    }
  }

  async componentWillMount() {
    const user = await UserService.me();
    this.setState({ user })
  }

  _goBack(){ this.props.navigation.goBack() }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Button 
          icon={ <Icon name={(Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back')} size={20}
          type="ionicon" color={Colors.primary} /> }
          text={Lang.t(`welcome.phoneInput.backText`)} clear={true} 
          textStyle={ { color: Colors.primary, fontSize: 20 } }
          containerStyle={ styles.backButtonContainer } onPress={ () => { this._goBack() } }
        />
        <FadeInFromRight delay={300}>
          <Text h2 style={styles.title}>{Lang.t('welcome.phoneInput.title', this.state.user)}</Text>
        </FadeInFromRight>
        <FadeInFromLeft delay={600}>
          <List>
            <ListItemPicker
              ref={(c) => { this._countrypicker = c }}
              title={Lang.t('country.placeholder')}
              rightTitle={Lang.t(`country.list.${this.state.country}`)}
              activeTitle={Lang.t(`country.list.${this.state.country}`)}
              selectedValue={this.state.country}
              onValueChange={(itemValue) => this.setState({ country: itemValue, phone: '', valid: false })}
              items={this.countries.map((country) => ({
                label: Lang.t(`country.list.${country}`), 
                value: country, 
                key: country,
              }))}
            />
            <ListItem
              title={Lang.t(`country.phoneData.${this.state.country}.code`)}
              hideChevron
              textInput
              textInputValue={this.state.phone}
              textInputKeyboardType='phone-pad'
              textInputPlaceholder={Lang.t(`country.phoneData.${this.state.country}.placeholder`)}
              textInputOnChangeText={(phone) => {
                this.setState({ phone, valid: isValidNumber(phone, this.state.country) })
              }}
              textInputOnBlur={(event) => {
                const phone = event.nativeEvent.text
                if(phone){
                  this.setState({ phone, valid: isValidNumber(phone, this.state.country) })
                }
              }}
              onPress={() => this._countrypicker.hide()}
              textInputOnFocus={() => this._countrypicker.hide()}
            />
          </List>
        </FadeInFromLeft>
        <FadeInFromTop delay={600}>
          <Text style={styles.description}>{Lang.t('welcome.phoneInput.description')}</Text>
          <Button
            disabled={!this.state.valid}
            text={Lang.t('welcome.phoneInput.buttonLabel')}
            textStyle={styles.buttonText}
            containerStyle={styles.buttonContainer}
            buttonStyle={[styles.button, this.state.valid ? null : styles.buttonDisabled]}
            iconRight
            icon={<Ionicons name={(Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward')} color="white" size={18} />}
            onPress={() => this.props.navigation.navigate('PhoneVerification', this.state) }
          />
        </FadeInFromTop>
      </KeyboardAvoidingView>
    );
  }

}

const styles = StyleSheet.create({
  ...Tour,
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.light
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
  buttonDisabled: {
    borderRadius: 50,
    backgroundColor: Colors.muted,
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
  disclaimer: {
    margin: 15,
    marginBottom: 0,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 12,
  }
});
