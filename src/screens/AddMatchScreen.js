import React from 'react';
import moment from 'moment'
import * as Firebase from 'firebase';

// UI
import Colors from 'constants/Colors';
import Lang from 'lang'
import { ActivityIndicator, StyleSheet, Alert, Share, View } from 'react-native';
import { Text, Button } from 'react-native-elements';

// App
import MatchForm from 'components/MatchForm';
import { Ionicons } from '@expo/vector-icons';

/** @classdesc This class represent a screen in the device which let the players. 
 *  1 - Create a Match by tapping in the add button located in upper right corner
 *  2 - Edit a Match by tapping in the match that the want
 *  3 - Remove a match by tapping in the remove button located in the upper left corner.
*/

export default class AddMatchScreen extends React.Component {
  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerRight = (
      <Text style={styles.headerButton} onPress={params.handleSave ? (params.handleSave) : () => null}>
        {Lang.t(params.match ? 'action.edit' : 'action.done')}
      </Text>
    )

    if (params.isSaving) {
      headerRight = <ActivityIndicator style={styles.headerActivityIndicator} />;
    }

    return {
      title: Lang.t('addMatch.title'),
      headerLeft: (<Text style={styles.headerButton} onPress={() => navigation.dispatch({ type: 'Navigation/BACK' })}>{Lang.t('action.close')}</Text>),
      headerRight: headerRight
    }
  }

  state = {
    match: {
      name: null,
      place: null,
      locationFound: false,
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
    let sharingButton;
    if (this.state.match.key) {
      sharingButton = (
        <Button
          title={Lang.t(`match.inviteButtonText`)}
          icon={<Ionicons name={'ios-share'} color={'white'} size={24} />}
          iconRight
          style={styles.buttonRaw}
          buttonStyle={styles.button}
          onPress={() => this.share(this.state.match)}
        />
      )
    }
    return (
      <View style={styles.container}>
        <MatchForm
          match={this.state.match}
          onChange={(match) =>
            this.setState({ match }
            )}
          onPlacePress={(match) => {
            this.props.navigation.navigate('MatchLocation', {
              match,
              onLocationSave: (location, match) => this.setState({ match })
            })
          }}
        />
        {sharingButton}
      </View>
    )
  }

  /** This method do all process to share a match using the native sharing tools of the devices 
   * @param match to be shared, we use it in order to take information to sahe
   * 
   * The process is:
   * 1 - Build the invite text body
   * 2 - Build the invite text footer
   * 3 - Display the share native tool & share per se. 
  */
  share(match) {
    const bodyText = this._buildBodyText(match)
    const footText = this._buildFooterText()
    const text = `${inviteText}\n\n----------\n${inviteFooter}\n\n`

    Share.share(
      {
        title: Lang.t(`match.invitationTitle`),
        message: text,
        url: match.locationUrl,
      },
      {
        dialogTitle: Lang.t(`match.invitationDialogTitle`)
      }
    )
  }

  /** This method is the first step of the method @method share, and it's mission is 
   * to build the sharing invitation body text   
   * @param match inherited from the share method
   * @returns the invitation body label
  */
  _buildBodyText(match) {
    let now = moment()
    let matchDate = moment(match.date)
    let diff = now.diff(matchDate, 'days')
    let matchDateOn = ''
    if(diff < -1 || 1 < diff){
      matchDateOn = Lang.t(`match.on`) + ' '
    }

    return Lang.t('match.invitationText', {
      appName: Lang.t('app.name'),
      matchDate: matchDate.calendar(),
      matchPlace: match.place,
      matchDateOn: matchDateOn,
    });
  }

  /** This method is the second step of the mehotd @method share, and it's mission is 
   * to build the sharing invitation footer text   
   * @returns the invitation footer label
  */
  _buildFooterText() {
    return Lang.t('match.invitationFooter', {
      appName: Lang.t('app.name'),
      appSlogan: Lang.t('app.slogan'),
      appContactEmail: Lang.t('app.contactEmail'),
    })
  }

  _handleSave = async () => {
    let match = Object.assign({}, this.state.match)

    if (!match.name) {
      return Alert.alert(Lang.t(`addMatch.noNameDefined`))
    }

    if (!match.locationFound) {
      return Alert.alert(Lang.t(`addMatch.noLocationDefined`))
    }

    // Update state, show ActivityIndicator
    this.props.navigation.setParams({ isSaving: true });

    // Get match data
    match.createdAt = Firebase.database.ServerValue.TIMESTAMP

    // Fb connection
    const uid = Firebase.auth().currentUser.uid;
    const db = Firebase.database();

    // Match key detection/creation
    let key = match.key
    if (!key) {
      key = db.ref().child('matches').push().key
    }
    delete match.key // key is not saved as a field

    let updates = {};
    updates['/matches/' + key] = match;
    updates['/users/' + uid + '/matches/' + key] = { date: new Date(match.date) }

    db.ref().update(updates).then(() => {
      this.props.navigation.setParams({ isSaving: false });
      this.props.navigation.dispatch({ type: 'Navigation/BACK' });
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
  container: {
    flex: 1,
  },
  button: {
    width: 400,
    borderRadius: 0,
  },
  buttonRaw: {
    width: 400
  }
})
