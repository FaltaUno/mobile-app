import React from 'react';

import { StyleSheet, Text } from 'react-native';

import Lang from 'lang'
import Colors from 'constants/Colors';

import MyMatchesList from 'components/MyMatchesList';

export default class MatchListScreen extends React.Component {

  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    let navigationOptions = {
      title: Lang.t('myMatches.title'),
      headerLeft: (
        <Text style={styles.headerButton} onPress={() => navigation.setParams({ deleteMode: true })}>
          {Lang.t('action.edit')}
        </Text>
      ),
      headerRight: (
        <Text style={styles.headerButton} onPress={() => navigation.navigate('AddMatch')}>
          {Lang.t('action.add')}
        </Text>
      )
    }

    if (params.deleteMode) {
      navigationOptions.headerLeft = (
        <Text style={styles.headerButton} onPress={() => navigation.setParams({ deleteMode: false })}>
          {Lang.t('action.done')}
        </Text>
      )
      delete navigationOptions.headerRight;
    }

    return navigationOptions
  }

  render() {
    let { state } = this.props.navigation;
    const deleteMode = state.params ? state.params.deleteMode : false;
    return (
      <MyMatchesList onPress={(match) => this.props.navigation.navigate("AddMatch", { match: match })}
        deleteMode={deleteMode} onMatchDelete={(matches) => {
          if (matches.length === 0) {
            this.props.navigation.setParams({ deleteMode: false })
          }
        }} />
    )
  }
}

const styles = StyleSheet.create({
  headerButton: {
    color: Colors.tintColor,
    fontSize: 16,
    marginLeft: 15,
    marginRight: 15,
  },
})
