import React from 'react';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

import Lang from 'lang';
import { Tour } from 'styles';

import UserService from 'services/UserService';
import Colors from '../constants/Colors';

export default class HiScreen extends React.Component {
  static navigationOptions = () => ({
    title: Lang.t('welcome.hi.headerTitle')
  });

  state = {
    loading: true,
    user: {},
  }

  componentWillMount() {
    UserService.me().then((user) => this.setState({ user, loading: false }))
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Ionicons style={styles.icon} name={(Platform.OS === 'ios' ? 'ios-hand-outline' : 'md-hand')} size={96}/>
        <Text h1 style={styles.title}>{Lang.t('welcome.hi.title', this.state.user)}</Text>
        <Text h4 style={styles.description}>{Lang.t('welcome.hi.description')}</Text>
        <Button 
          title={Lang.t('welcome.hi.buttonLabel')}
          textStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          iconRight
          icon={<Ionicons name={(Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward')} color="white" size={18}/>}
          onPress={()=>this.props.navigation.navigate('PhoneInput')}
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
    backgroundColor: Colors.light
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
  }
});
