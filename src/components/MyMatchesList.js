import React from 'react';

import { ScrollView, View, StyleSheet } from 'react-native';
import { List, ListItem, Text } from 'react-native-elements';

import * as Firebase from 'firebase';
import moment from 'moment'

import Lang from 'lang'
import Colors from 'constants/Colors';

export default class MyMatchesList extends React.Component {

  state = {
    matches: []
  }

  constructor(props) {
    super(props);
    // Get user matches
    const uid = Firebase.auth().currentUser.uid
    const db = Firebase.database()
    const matchesRef = db.ref('matches')
    this.userMatchesRef = db.ref(`users/${uid}/matches`);
    this.userMatchesRef.orderByChild('date').on('child_added', (userMatch) => {
      matchesRef.child(userMatch.key).once('value', (matchSnap) => {
        
        /**
         * Esta parte del codigo esta haciendo que cuando se haga un update en AddMatchScreen, 
         * se agrege temporalmente a la lista de matches una replica del partido modificado como 
         * si fuese uno nuevo. 
         * 
         * Pasos para replicar el comportamiento:
         * 1 - Editar un partido existente,
         * 2 - Se va a agregar como una nueva row
         * 3 - Cerrar la app y volverla a abrir
         * Como resultado se va a ver como se esperaba, es decir, la cantidad de partidos correcta.
         * 
         * En la BD en ningun momento se duplican los partidos, es solo a nivel de FrontEnd
         */
        
        let match = matchSnap.val()
        match.key = matchSnap.key; // ID de firebase
        let matches = this.state.matches.slice()
        matches.push(match)
        // matches = matches.sort((matchA, matchB) => {
        //   return matchA.date > matchB.date
        // })

        this.setState({ matches })
      })
    })
  }

  componentWillUnmount() {
    this.userMatchesRef.off('child_added');
  }

  render() {
    const matches = this.state.matches

    if (!matches.length) {
      return (
        <View style={styles.emptyMacthesContainer}>
          <Text style={styles.emptyMatchesText}>{Lang.t(`matches.noMatchesAvailable`)}</Text>
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
