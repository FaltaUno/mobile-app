import React from 'react';

import { StyleSheet, Alert, Platform } from 'react-native';

import Lang from 'lang'
import Colors from 'constants/Colors';

import MyMatchesList from 'components/MyMatchesList';
import { Ionicons } from '@expo/vector-icons';

export default class MatchListScreen extends React.Component {
  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => ({
    title: Lang.t('myMatches.title'),
    headerRight: (
      <Ionicons
        name={(Platform.OS === 'ios' ? 'ios' : 'md') + '-add'}
        size={28}
        style={styles.headerRightIconContainer}
        color={Colors.tintColor}
        onPress={() => navigation.navigate('AddMatch')}
      />
    )
  })

  render() {
    return (
      <MyMatchesList onPress={(match) => Alert.alert(`Edit ${match.name}`)} />
    )
  }
}

const styles = StyleSheet.create({
  headerRightIconContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
})
