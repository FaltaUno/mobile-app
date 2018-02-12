import React from 'react';
import { View, StyleSheet, Platform, Picker } from 'react-native';
import { Text, Button, List, ListItem } from 'react-native-elements';
import { parse, format, isValidNumber } from 'libphonenumber-js'

import UserService from 'services/UserService';
import Lang from 'lang';

import { Ionicons } from '@expo/vector-icons';
import ListItemToggleComponent from 'components/ListItemToggleComponent';
import Colors from 'constants/Colors';

export default class HiScreen extends React.Component {
  static navigationOptions = () => ({
    headerStyle: styles.headerSlide
  });

  countries = ['AR', 'UY']

  state = {
    country: 'AR',
    phone: '',
    valid: false,
  }

  async componentWillMount() {
    const user = await UserService.me();
    this.setState({ user })
  }

  render() {
    return (
      <View style={styles.container}>
        <Ionicons style={styles.icon} name={(Platform.OS === 'ios' ? 'ios-call-outline' : 'md-call')} size={96} />
        <Text h2 style={styles.title}>{Lang.t('welcome.phoneVerification.title', this.state.user)}</Text>
        <List>
          <ListItemToggleComponent
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
              this.setState({ phone, valid: isValidNumber(phone, this.state.country) })
            }}
          />
        </List>
        <Text style={styles.description}>{Lang.t('welcome.phoneVerification.description')}</Text>
        <Button
          disabled={!this.state.valid}
          text={Lang.t('welcome.phoneVerification.buttonLabel')}
          textStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
          buttonStyle={[styles.button, this.state.valid ? null : styles.buttonDisabled]}
          iconRight
          icon={<Ionicons name={(Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward')} color="white" size={18} />}
        />
        <Text style={styles.disclaimer}>{Lang.t(`welcome.phoneVerification.disclaimer`)}</Text>
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
    paddingLeft: 0,
    paddingRight: 0,
  },
  buttonContainer:{
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonDisabled:{
    backgroundColor: Colors.muted,
  },
  button:{
    justifyContent: 'flex-start',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 30,
    paddingRight: 10,
    width: '100%',
  },
  buttonText: {
    width: '100%',
    textAlign: 'center',
  },
  disclaimer: {
    margin: 15,
    marginBottom: 0,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 12,
  }
});
