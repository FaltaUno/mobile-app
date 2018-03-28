import React from 'react';
import { ActivityIndicator, ScrollView, View, StyleSheet, Platform } from 'react-native';
import * as Firebase from 'firebase';

import Colors from 'constants/Colors';
import Lang from 'lang';
import { Ionicons } from '@expo/vector-icons';
import { Text, ListItem, List } from 'react-native-elements';

import LocationService from 'services/LocationService';
import UserService from 'services/UserService';

export default class NearPlayerScreen extends React.Component {
  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => ({
    title: Lang.t('home.title'),
    headerStyle: {
        backgroundColor: Colors.primary 
    },
    headerTitleStyle: {
      color: Colors.light,
      fontWeight: 'bold'
    },
    headerRight: (
      <Ionicons
        name={(Platform.OS === 'ios' ? 'ios-settings' : 'md-settings')}
        size={28}
        style={styles.headerRightIconContainer}
        color={Colors.dark}
        onPress={() => navigation.navigate('MyProfile')}
      />
    ),
  })

  constructor(props) {
    super(props);
    this.usersRef = Firebase.database().ref(`users`)
      .orderByChild(`available`).equalTo(true);

    this.state = {
      loading: true,
      search: "",
      currentPosition: {},
      players: {},
      currUser: {}
    }
  }

  componentWillMount() {
    // 1 - Get the user from firebase
    // 2 - Update the new position, location and locationPermission
    LocationService.getLocationAsync().then(({ position, location }) => {
      UserService.setMyLocation(position, location).then(me => {
        this.setState({ currUser: me });
        this._getNearPlayers(me.key);
      })
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

    if (currUser) {
      keys.forEach((key) => {
        const player = players[key]
        // If the user did the welcome tour and has coordinates
        if (!player.firstTime && player.position.coords) {
          const playerDistance = parseInt(LocationService.calculatePlayerDistance(currUser, player))
          if (currUser.distance <= playerDistance) {
            delete players[key]
          }
        }
      })
      this.setState({ loading: false, players: players })
    }
  }

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
                      const dist = parseInt(LocationService.calculatePlayerDistance(currUser, players[key]));
                      const player = players[key];
                      return (
                        <ListItem
                          key={player.uid}
                          roundAvatar
                          title={player.displayName}
                          avatar={{ uri: player.photoURL }}
                          subtitle={Lang.t(`playerCard.fromDistance`, { distance: dist })}
                          onPress={() => this.props.navigation.navigate('SelectMatch', { player })}
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
        <View style={styles.emptyPlayersContainer}>
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
  headerRightIconContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
  emptyPlayersContainer: {
    flex: 1,
    marginBottom: 60,
    justifyContent: 'center',
  },
  emptyPlayers: {
    textAlign: 'center',
    fontSize: 24,
    color: Colors.muted
  }
})
