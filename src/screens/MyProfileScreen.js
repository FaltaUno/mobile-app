import React from 'react';

import { ActivityIndicator, Alert, StyleSheet, View, ScrollView, Text } from 'react-native';
import { List, ListItem } from 'react-native-elements';

import PlayerCard from 'components/PlayerCard';
import PlayerProfileForm from 'components/PlayerProfileForm';

import Lang from 'lang'
import Colors from 'constants/Colors';

import AuthService from 'services/AuthService';
import UserService from 'services/UserService';

export default class MyProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: Lang.t('myProfile.title'),
    headerLeft: (
      <Text style={styles.headerButton} onPress={() => navigation.dispatch({ type: 'Navigation/BACK' })}>{Lang.t('action.close')}</Text>
    ),
  });

  state = {
    loading: true,
    user: {},
  }

  async componentWillMount(){
    let user = await UserService.me();
    this.setState({user, loading: false});
  }

  render() {
    if (this.state.loading) {
      return <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    }

    const user = this.state.user

    return (
      <ScrollView>
        <PlayerCard player={user} />
        <PlayerProfileForm player={user} onChange={(player) => UserService.update(player)}/>

        <List containerStyle={styles.logoutContainer}>
          <ListItem
            title={Lang.t(`myProfile.logout`)}
            hideChevron
            titleStyle={styles.logout}
            containerStyle={styles.logoutWrapper}
            onPress={() => AuthService.signOut().then(() => Alert.alert(Lang.t(`myProfile.logoutSuccess`)))}
          />
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
  headerButton: {
    color: Colors.tintColor,
    fontSize: 16,
    marginLeft: 15,
    marginRight: 15,
  },
  logoutContainer: {
    borderTopColor: Colors.danger,
    marginTop: 20,
  },
  logoutWrapper: {
    borderBottomColor: Colors.danger,
    paddingTop: 15,
    paddingBottom: 15,
  },
  logout: {
    color: Colors.danger,
    textAlign: 'center',
  },
})
