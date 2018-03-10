import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, Button } from 'react-native-elements';

import Lang from 'lang';

import { Ionicons } from '@expo/vector-icons';
import UserService from 'services/UserService';

export default class ConfigFinishScreen extends React.Component {
  static navigationOptions = () => ({
    title: Lang.t('welcome.configFinish.headerTitle')
  });

  render() {
    return (
      <View style={styles.container}>
        <Ionicons style={styles.icon} name={(Platform.OS === 'ios' ? 'ios-hand-outline' : 'md-hand')} size={96} />
        <Text h2 style={styles.title}>{Lang.t('welcome.configFinish.title')}</Text>
        <Text h4 style={styles.description}>{Lang.t('welcome.configFinish.description')}</Text>
        <Button
          text={Lang.t('welcome.configFinish.buttonLabel')}
          textStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          onPress={() => UserService.firstTimeIsDone()}
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
  buttonContainer: {
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  button: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  buttonText: {
    width: '100%',
  },
});
