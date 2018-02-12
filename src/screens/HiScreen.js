import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, Button } from 'react-native-elements';

import UserService from 'services/UserService';
import Lang from 'lang';

import { Ionicons } from '@expo/vector-icons';

export default class HiScreen extends React.Component {
  static navigationOptions = () => ({
    title: Lang.t('welcome.hi.headerTitle')
  });

  state = {
    user: {}
  }

  async componentWillMount() {
    const user = await UserService.me();
    this.setState({ user })
  }

  render() {
    return (
      <View style={styles.container}>
        <Ionicons style={styles.icon} name={(Platform.OS === 'ios' ? 'ios-hand-outline' : 'md-hand')} size={96}/>
        <Text h1 style={styles.title}>{Lang.t('welcome.hi.title', this.state.user)}</Text>
        <Text h4 style={styles.description}>{Lang.t('welcome.hi.description')}</Text>
        <Button 
          text={Lang.t('welcome.hi.buttonLabel')}
          textStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          iconRight
          icon={<Ionicons name={(Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward')} color="white" size={18}/>}
          onPress={()=>this.props.navigation.navigate('PhoneVerification')}
        />
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
    textAlign: 'center'
  },
  title:{
    marginTop: 20,
    textAlign: 'center'
  },
  description:{
    textAlign: 'center',
    padding: 20,
  },
  buttonContainer:{
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
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
  }
});
