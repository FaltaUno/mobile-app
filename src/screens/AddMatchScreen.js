import React from 'react';
import * as Firebase from 'firebase';

// UI
import Colors from 'constants/Colors';
import Lang from 'lang'
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

// App
import MatchForm from 'components/MatchForm';
import LocationService from 'services/LocationService';

export default class MatchAddScreen extends React.Component {
  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerRight = (
      <Text style={styles.headerButton} onPress={params.handleSave ? (params.handleSave) : () => null}>
        {Lang.t(params.match ? 'action.edit' : 'action.add')}
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
    match: {
      name: null,
      place: null,
      date: new Date(),
    },
  }

  componentDidMount() {
    // We can only set the function after the component has been initialized
    const { params = {} } = this.props.navigation.state;
    this.props.navigation.setParams({ handleSave: this._handleSave });

    if (params.match) {
      this.setState({ match: params.match })
    }
  }

  render() {
    return (
      <MatchForm
        match={this.state.match}
        onChange={(match) =>
          this.setState({ match }
        )}
      />
    )
  }

  _handleSave = async () => {
    // Update state, show ActivityIndicator
    this.props.navigation.setParams({ isSaving: true });

    // Get match data
    let match = Object.assign({}, this.state.match)
    match.createdAt = Firebase.database.ServerValue.TIMESTAMP
    match.locationFound = false;
    match.location = { lat: null, lng: null }
    match.locationUrl = null;
    if(match.place){
      match.locationFound = true;
      match.location = await LocationService.locationFromAddress(match.place)
      match.locationUrl = LocationService.linkFromLocation(match.location) 
    }

    // Fb connection
    const uid = Firebase.auth().currentUser.uid;
    const db = Firebase.database();

    // Match key detection/creation
    let key = match.key
    if (! key) {
      key = db.ref().child('matches').push().key
    }
    delete match.key // key is not saved as a field

    let updates = {};
    updates['/matches/' + key] = match;
    updates['/users/' + uid + '/matches/' + key] = { date: new Date(match.date) }

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
