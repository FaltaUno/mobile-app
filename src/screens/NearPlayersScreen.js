import React from 'react';
import { ActivityIndicator, ScrollView, View, StyleSheet } from 'react-native';
import { SearchBar, Text, ListItem, List, Icon } from 'react-native-elements';
import Colors from 'constants/Colors';
import Lang from 'lang';
import * as Firebase from 'firebase';

export default class NearPlayerScreen extends React.Component {

  constructor(props) {
    super(props);
    this.usersRef = Firebase.database().ref(`users`)
      .orderByChild(`available`)
      .equalTo(true);

    this.state = {
      loading: true,
      search: "",
      currentPosition: {},
      players: {},
      currUser: {}
    }
  }

  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => ({
    title: Lang.t('home.title'),
      headerRight: (<Icon name='settings' color={ Colors.tabIconSelected }
      onPress={ () => navigation.navigate('MyProfile') } />)
  });

  componentWillMount() {
    let me = Firebase.auth().currentUser;
    Firebase.database().ref(`users/${me.uid}`)
      .on('value', (snapshot) => {
        this.setState( { currUser: snapshot.val() } );
        this._getNearPlayers(me.uid);
      })
  }

  /** It uses the userKey to remove the user itself in the players List */
  _getNearPlayers(userKey) {
      this.usersRef.on('value', (snapshot) => {
        let playerList = snapshot.val()
        delete playerList[userKey]
        this._filterLongDistancePlayers(playerList)
      });
  }

  _filterLongDistancePlayers(players) {
    const currUser = this.state.currUser
    const keys = Object.keys(players)
    if(currUser) {
      keys.forEach((key) => {
        const playerDistance = parseInt(this._calculatePlayerDistance(currUser, players[key]))
        if(currUser.distance <= playerDistance) {
          delete players[key]
        } 
      }) 
      this.setState({loading: false, players: players })
    }
  }

  _calculatePlayerDistance(currUser, otherPlayer) {
    const R = 6371;

    const cuLat = currUser.position.coords.latitude;
    const cuLong = currUser.position.coords.longitude;
    const opLat = otherPlayer.position.coords.latitude;
    const opLong = otherPlayer.position.coords.longitude;

    let dLat = this._deg2rad(opLat - cuLat);
    let dLon = this._deg2rad(opLong - cuLong);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this._deg2rad(cuLat)) * Math.cos(this._deg2rad(opLat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
  }

  _deg2rad(deg) { return deg * (Math.PI / 180) }

  render() {
    if (this.state.loading) {
      return <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    } else {
      const players = this.state.players
      const playersKeys = Object.keys(players)
      const currUser = this.state.currUser
      // <SearchBar
      //   clearIcon={this.state.search ? { name: 'clear', type: 'ionicons' } : false}
      //   containerStyle={styles.searchBar}
      //   inputStyle={styles.input}
      //   lightTheme
      //   onChangeText={(search) => { this.setState({ search }) }}
      //   placeholder={Lang.t('home.placeholder')} />

      if (playersKeys.length) {
        return (
          <View style={styles.container}>
            <ScrollView>
              <List>
                {
                  playersKeys.map((key) => {
                    if (currUser) {
                      const dist = parseInt(this._calculatePlayerDistance(currUser, players[key]));
                      const player = players[key];
                      return (
                        <ListItem
                          key={player.uid}
                          roundAvatar
                          title={player.displayName}
                          avatar={{ uri: player.photoURL }}
                          subtitle={Lang.t(`playerCard.fromDistance`, { distance: dist })}
                          onPress={() => this.props.navigation.navigate('MatchSelector', { player })}
                        />
                      )
                    }
                  })
                }
              </List>
            </ScrollView>
          </View>
        )
      }
      return (
        <View style={styles.container}>
          <Text style={styles.emptyPlayers}>{Lang.t(`home.noPlayers`)}</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  searchBar: {
    backgroundColor: Colors.light,
    width: '100%',
  },
  input: {
    backgroundColor: Colors.tabBar
  },
  emptyPlayers: {
    marginTop: 10,
    textAlign: 'center'
  }
})
