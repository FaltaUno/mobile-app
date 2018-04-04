import React from 'react';

import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';

import Lang from 'lang'
import Colors from 'constants/Colors';
import { headerStyle } from 'constants/Theme';

import MyMatchesList from 'components/MyMatchesList';

export default class SelectMatchScreen extends React.Component {
  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = () => ({
    title: Lang.t('matchSelector.title'),
    ...headerStyle,
    tabBarVisible: false,
  })

  render() {
    const { player } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{Lang.t(`matchSelector.label`, player)}</Text>
        <MyMatchesList player={player} onPress={(match) =>this.props.navigation.navigate('Invite', { player, match })} />
        <Button
          text={Lang.t(`matches.addMatch`)}
          buttonStyle={styles.button}
          style={styles.buttonContainer}
          backgroundColor={Colors.primary}
          onPress={() => this.props.navigation.navigate('AddMatch')} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    borderRadius: 0,
    backgroundColor: Colors.primary,
    width: 400
  },
  buttonContainer: {
    width: 400,
  },
  label: {
    textAlign: 'center',
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 16,
  }
})
