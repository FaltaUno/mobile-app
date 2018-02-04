import React from 'react';
import * as Firebase from 'firebase';

// UI
import Colors from 'constants/Colors';
import Lang from 'lang'
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

// App
import MatchForm from 'components/MatchForm';

export default class MatchAddScreen extends React.Component {
  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    let headerRight = (
      <Text style={styles.headerButton} onPress={params.handleSave ? (params.handleSave) : () => null}>
        {Lang.t('action.add')}
      </Text>
    )

    if (params.isSaving) {
      headerRight = <ActivityIndicator style={styles.headerActivityIndicator} />;
    }

    return {
      title: Lang.t('addMatch.title'),
      headerLeft: (<Text style={styles.headerButton} onPress={() => navigation.goBack()}>{Lang.t('action.close')}</Text>),
      headerRight: headerRight
    }
  }

  state = {
    match: {}
  }

  componentDidMount() {
    // We can only set the function after the component has been initialized
    this.props.navigation.setParams({ handleSave: this._handleSave });
  }

  render() {
    return (<MatchForm onChange={(match) => this.setState({ match })} />)
  }

  _handleSave = () => {
    // Update state, show ActivityIndicator
    this.props.navigation.setParams({ isSaving: true });

    // Get match data
    let match = Object.assign({}, this.state.match)
    const dateTimestamp = match.date.getTime()
    match.date = dateTimestamp
    match.createdAt = Firebase.database.ServerValue.TIMESTAMP

    // Fb connection
    const uid = Firebase.auth().currentUser.uid;
    const db = Firebase.database();

    // Match key
    const key = db.ref().child('matches').push().key;

    let updates = {};
    updates['/matches/' + key] = match;
    updates['/users/' + uid + '/matches/' + key] = { date: match.date }

    // Exec update
    db.ref().update(updates).then(() => {
      this.props.navigation.setParams({ isSaving: false });
      this.props.navigation.goBack();
    })
  }
}

const styles = StyleSheet.create({
  headerActivityIndicator: {
    marginLeft: 15,
    marginRight: 15,
  },
  headerButton: {
    color: Colors.tintColor,
    fontSize: 16,
    marginLeft: 15,
    marginRight: 15,
  },
})
