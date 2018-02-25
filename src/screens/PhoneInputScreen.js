import React from 'react';
import { View, StyleSheet, Platform, Picker } from 'react-native';
import { Text, Button, List, ListItem } from 'react-native-elements';
import { isValidNumber } from 'libphonenumber-js'

import UserService from 'services/UserService';
import Lang from 'lang';

import { Ionicons } from '@expo/vector-icons';
import ListItemToggleComponent from 'components/ListItemToggleComponent';
import Colors from 'constants/Colors';
import { Tour } from '../styles';

export default class PhoneInputScreen extends React.Component {
  static navigationOptions = () => ({
    title: Lang.t('welcome.phoneInput.headerTitle')
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

  render() {
    return (
      <View style={styles.container}>
        <Ionicons style={styles.icon} name={(Platform.OS === 'ios' ? 'ios-call-outline' : 'md-call')} size={96} />
        <Text h2 style={styles.title}>{Lang.t('welcome.phoneInput.title', this.state.user)}</Text>
        <List>
          <ListItemToggleComponent
            ref={(c) => { this._countrypicker = c }}
            title={Lang.t('country.placeholder')}
            rightTitle={Lang.t(`country.list.${this.state.country}`)}
            activeTitle={Lang.t(`country.list.${this.state.country}`)}
            component={(
              <Picker
                selectedValue={this.state.country}
                onValueChange={(itemValue) => this.setState({ country: itemValue, phone: '', valid: false })}>
                {
                  this.countries.map((country) => (
                    <Picker.Item label={Lang.t(`country.list.${country}`)} value={country} key={country} />
                  ))
                }
              </Picker>
            )}
          />
          <ListItem
            title={Lang.t(`country.phoneData.${this.state.country}.code`)}
            hideChevron
            textInput
            textInputValue={this.state.phone}
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
        <Text style={styles.disclaimer}>{Lang.t(`welcome.phoneInput.disclaimer`)}</Text>
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
    paddingLeft: 0,
    paddingRight: 0,
  },
  buttonDisabled: {
    backgroundColor: Colors.muted,
  },
  disclaimer: {
    margin: 15,
    marginBottom: 0,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 12,
  }
});
