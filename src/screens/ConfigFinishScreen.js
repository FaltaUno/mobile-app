import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, Button, Icon } from 'react-native-elements';

import Lang from 'lang';
import Colors from '../constants/Colors';
import Tour from '../styles/Tour';

import UserService from 'services/UserService';
import FadeInFromTop from '../components/animations/FadeInFromTop';

export default class ConfigFinishScreen extends React.Component {
  static navigationOptions = () => ({
    header: null
  });

  _goBack() { this.props.navigation.goBack() }

  render() {
    return (
      <View style={styles.container}>
        <Button 
          icon={ <Icon name={(Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back')} size={20}
          type="ionicon" color={Colors.primary} /> }
          title={Lang.t(`welcome.configFinish.backText`)} clear={true} 
          titleStyle={ { color: Colors.primary, fontSize: 20 } }
          containerStyle={ styles.backButtonContainer } onPress={ () => { this._goBack() } }
        />

        <FadeInFromTop delay={200}>
          <Text h2 style={styles.title}>{Lang.t('welcome.configFinish.title')}</Text>
        </FadeInFromTop>
        <FadeInFromTop delay={700}>
          <Text h4 style={styles.description}>{Lang.t('welcome.configFinish.description')}</Text>
        </FadeInFromTop>
        <FadeInFromTop delay = {1200}>
          <Button
            title={Lang.t('welcome.configFinish.buttonLabel')}
            textStyle={styles.buttonText}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            onPress={() => UserService.firstTimeIsDone()}
          />
        </FadeInFromTop>
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
  buttonContainer: {
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonText: {
    width: '100%',
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
  }
});
