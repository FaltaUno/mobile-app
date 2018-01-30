import React from 'react';

import { ScrollView, View, StyleSheet } from 'react-native';
import { List, ListItem, Text, Button, Icon } from 'react-native-elements';
import MatchesList from '../components/MatchesList';

import * as Firebase from 'firebase';
import moment from 'moment'

import Lang from 'lang'
import Colors from 'constants/Colors';

export default class MatchListScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      matches: {}
    }
  }

  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({navigation}) => ({
    title: Lang.t('matchList.title'),
    headerRight: (<Icon name='settings' color={ Colors.tabIconSelected }
    onPress={ () => navigation.navigate('MyProfile') } />)
  })

  componentDidMount(){
    const uid = Firebase.auth().currentUser.uid
    const db = Firebase.database()
    const matchesRef = db.ref('matches')
    db.ref(`users/${uid}/matches`).orderByChild('date').on('child_added', (userMatch) => {
      matchesRef.child(userMatch.key).once('value', (matchSnap) => {
        let match = {
          [matchSnap.key]: matchSnap.val()
        }
        const matches = Object.assign({}, this.state.matches, match)
        this.setState({ matches })
      })
    })
  }

  render() {
    const matches = this.state.matches
    const matchesKeys = Object.keys(matches)
    return (
      <View style={styles.container}>
        {!matchesKeys.length ? (
          <View style={styles.emptyMacthesContainer}>
            <Text style={styles.emptyMatchesText}>{Lang.t(`matchList.noMatchesAvailable`)}</Text>
          </View>
        ) : (
          <View>
            <MatchesList matches={ matches } hideChevron={ true } />
          </View>
          )
        }
        <Button
          title={Lang.t(`matchList.addMatch`)}
          containerViewStyle={styles.addMatchButtonContainer}
          backgroundColor={Colors.primary}
          onPress={() => this.props.navigation.navigate('CreateMatch')} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyMacthesContainer: {
    flex: 1,
    marginBottom: 60,
    justifyContent: 'center',
  },
  emptyMatchesText: {
    alignSelf: 'center',
    fontSize: 24,
    color: Colors.muted
  },
  label: {
    textAlign: 'center',
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 16,
  },
  addMatchButtonContainer: {
    bottom: 0,
    marginLeft: 0,
    position: 'absolute',
    width: '100%',
  }
})
