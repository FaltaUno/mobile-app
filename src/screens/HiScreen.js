import React from 'react';
import { Animated, View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

import Lang from 'lang';
import { Tour } from 'styles';

import UserService from 'services/UserService';
import Colors from '../constants/Colors';
import FadeInView from '../components/animations/FadeInView';
import SpringView from '../components/animations/SpringView';

export default class HiScreen extends React.Component {

  static navigationOptions = () => ({
    title: Lang.t('welcome.hi.headerTitle'),
    header: null
  });

  state = {
    fadeAnim: new Animated.Value(0),
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
    const fade = this.state.fadeAnim
    return (
      <View style={styles.container}>
        {/* <Ionicons style={styles.icon} name={(Platform.OS === 'ios' ? 'ios-hand-outline' : 'md-hand')} size={96}/> */}
        <FadeInView duration={1000}>
          <Text h1 style={styles.title}>{Lang.t('welcome.hi.title', this.state.user)}</Text>
        </FadeInView>
        <FadeInView duration={1000} delay={500}>
          <Text h4 style={styles.description}>{Lang.t('welcome.hi.description')}</Text>
        </FadeInView>
        <FadeInView duration={1000} delay={1000}>
        <Button 
          title={Lang.t('welcome.hi.buttonLabel')}
          textStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          iconRight
          icon={<Ionicons name={(Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward')} color="white" size={18}/>}
          onPress={()=>this.props.navigation.navigate('PhoneInput')}
        />
        </FadeInView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ...Tour,
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.primary
  },
  icon: {
    textAlign: 'center',
    color: Colors.light
  },
  title:{
    marginTop: 20,
    textAlign: 'center',
    color: Colors.light
  },
  description:{
    textAlign: 'center',
    padding: 20,
    color: Colors.light
  }
});
