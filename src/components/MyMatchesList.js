import React from 'react';

import { ScrollView, View, StyleSheet, ActivityIndicator } from 'react-native';
import { List, ListItem, Text } from 'react-native-elements';

import * as Firebase from 'firebase';
import moment from 'moment'

import Lang from 'lang'
import Colors from 'constants/Colors';

export default class MyMatchesList extends React.Component {

  state = {
    loading: true,
    matches: []
  }

  constructor(props) {
    super(props);
    // Get user matches
    const uid = Firebase.auth().currentUser.uid
    const db = Firebase.database()
    this.matchesRef = db.ref('matches')
    this.userMatchesRef = db.ref(`users/${uid}/matches`);

    // First load
    this.userMatchesRef.orderByChild('date').once('value', (userMatchesRef) => {
      // Get all refs promises
      let matches$ = [];
      userMatchesRef.forEach((userMatch) => {
        matches$.push(this.matchesRef.child(userMatch.key).once('value'))
      })
      // Execute them all at the same time
      Promise.all(matches$)
        // once they are all finished
        .then((matchesSnap) => { this.fillInitialMatches(matchesSnap) })
        // After that, subscribe to child addition/modification events
        .then(() => { this.subscribeForMatchesEvents() })
    })
  }

  fillInitialMatches(matchesSnap){
    let matches = this.state.matches.slice()
    // Fill the array and mark the load as finished
    for (let matchSnap of matchesSnap) {
      let match = matchSnap.val()
      match.key = matchSnap.key; // ID de firebase
      matches.push(match)
    }
    this.setState({ loading: false, matches })
  }

  subscribeForMatchesEvents(){
    this.userMatchesRef.orderByChild('date').on('child_added', (userMatch) => {
      this.matchesRef.child(userMatch.key).once('value', (matchSnap) => {
        let match = matchSnap.val()
        match.key = matchSnap.key; // ID de firebase

        let matches = this.state.matches.slice()
        let matchIndex = matches.findIndex((matchSearch) => {
          return matchSearch.key === match.key;
        })

        // If the match is already preset, update it; otherwise push it
        matchIndex > -1 ? matches[matchIndex] = match : matches.push(match);

        // Sort by date ASC
        matches.sort(function (matchA, matchB) {
          return matchA.date < matchB.date ? -1 : (matchA.date > matchB.date ? 1 : 0)
        });

        this.setState({ matches })
      })
    })
  }

  componentWillUnmount() {
    this.userMatchesRef.off('child_added');
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    const matches = this.state.matches
    if (!matches.length) {
      return (
        <View style={styles.emptyMacthesContainer}>
          <Text style={styles.emptyMatchesText}>{Lang.t(`matches.noAvailable`)}</Text>
        </View>
      )
    }
    return (
      <ScrollView>
        <List>
          {matches.map((match, key) => {
            return (
              <ListItem
                key={key}
                title={match.name}
                subtitle={match.place}
                rightTitle={moment(match.date).calendar()}
                onPress={() => this.props.onPress(match)}
              />
            )
          })}
        </List>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
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
  }
})
