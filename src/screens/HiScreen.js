import React from 'react';
import { Animated, View, StyleSheet, Platform, ActivityIndicator, Image } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

import Lang from 'lang';
import { Tour } from 'styles';

import UserService from 'services/UserService';
import Colors from '../constants/Colors';

import PlainFadeIn from '../components/animations/PlainFadeIn';
import FadeInFromTop from '../components/animations/FadeInFromTop';

export default class HiScreen extends React.Component {

  static navigationOptions = () => ({
    title: Lang.t('welcome.hi.headerTitle'),
    header: null
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
        {/* <Image source={require("../../assets/images/falta-uno-logo.png")} alt="" style={styles.logo} /> */}
        <FadeInFromTop duration={1000} delay={200}>
          <Text h1 style={styles.title}>{Lang.t('welcome.hi.title', this.state.user)}</Text>
        </FadeInFromTop>
        <FadeInFromTop duration={1000} delay={700}>
          <Text h4 style={styles.description}>{Lang.t('welcome.hi.description')}</Text>
        </FadeInFromTop>
        <PlainFadeIn duration={1000} delay={1200}>
          <Button 
            text={Lang.t('welcome.hi.buttonLabel')}
            textStyle={styles.buttonText}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            iconRight
            icon={<Ionicons name={(Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward')} 
              color="white" size={18}/>}
            onPress={()=>this.props.navigation.navigate('PhoneInput')}
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
    backgroundColor: Colors.light
  },
  icon: {
    textAlign: 'center',
    color: Colors.light
  },
  title:{
    marginTop: 20,
    textAlign: 'center',
    color: Colors.dark
  },
  description:{
    textAlign: 'center',
    padding: 20,
    color: Colors.dark
  },
  logo: {
    height: 'auto',
    width: 'auto'
  }
});
