import React from 'react';

import { ActivityIndicator, StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-elements';
import moment from 'moment'

import Colors from 'constants/Colors';
import Lang from 'lang'

import PlayerCard from 'components/PlayerCard';
import WhatsAppInvite from 'components/WhatsAppInvite';

export default class InviteScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: Lang.t('invite.title', navigation.state.params.match),
    tabBarVisible: false,
  });

  state = {
    loading: false,
    player: {},
    match: {},
  }

  render() {
    if (this.state.loading) {
      return <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    }

    const { player, match } = this.props.navigation.state.params;
    return (
      <ScrollView>
        <PlayerCard player={player} />
        <Card title={Lang.t(`invite.invitationTitle`).toUpperCase()} containerStyle={styles.cardStyle}>
          <Text h4 style={styles.matchName}>{match.name}</Text>
          <Text style={styles.matchPlace}>{Lang.t(`invite.matchPlaceholder`, { place: match.place })}</Text>
          <Text style={styles.matchDate}>{moment(match.date).calendar()}</Text>
        </Card>
        <WhatsAppInvite player={player} match={match} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardStyle: {
    marginBottom: 15,
  },
  matchName:{
    textAlign: 'center',
    marginBottom: 10,
  },
  matchPlace: {
    fontSize: 18,
    textAlign: 'center',
  },
  matchDate: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.muted,
    textAlign: 'center',
  }
})
