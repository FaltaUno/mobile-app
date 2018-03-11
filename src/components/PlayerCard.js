import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Avatar } from 'react-native-elements';

import Colors from 'constants/Colors';

export default class PlayerCard extends React.Component {

  render() {
    const player = this.props.player
    return (
      <View style={styles.container}>
        <Avatar
          large
          rounded
          source={{ uri: player.photoURL }}
          containerStyle={styles.avatar}
        />
        <Text h4>{player.displayName}</Text>
        <Text style={styles.textMuted}>{player.email}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  textMuted: {
    color: Colors.muted,
  },
})
