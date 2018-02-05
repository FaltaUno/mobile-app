import React from 'react';

import { StyleSheet, View } from 'react-native';
import { List, ListItem, Slider } from 'react-native-elements';
import { format } from 'libphonenumber-js'

import Lang from 'lang'
import Colors from 'constants/Colors';
import moment from 'moment'

export default class MyProfileScreen extends React.Component {
  state = {
    player: {}
  }

  constructor(props){
    super(props)
    this.state.player = Object.assign({}, props.player);
  }

  render() {
    let player = this.state.player
    return (
      <View>
        <List>
          <ListItem
            hideChevron
            title={Lang.t(`myProfile.email`)}
            rightTitle={player.email}
            rightTitleStyle={styles.infoText}
          />
          <ListItem
            hideChevron
            title={Lang.t(`myProfile.phoneNumber`)}
            rightTitle={format(player.phone, 'International')}
            rightTitleStyle={styles.infoText}
          />
          <ListItem
            hideChevron
            title={Lang.t(`myProfile.memberSince`)}
            rightTitle={moment(player.createdAt).fromNow()}
            rightTitleStyle={styles.infoText}
          />
        </List>
        <List>
          <ListItem
            title={Lang.t('myProfile.available')}
            hideChevron
            switchButton
            switched={player.available}
            onSwitch={() => this._updateUser({ available: !player.available })}
          />
          <ListItem
            hideChevron
            title={Lang.t('myProfile.myLocation')}
            rightTitle={this._getLocationText()}
            rightTitleStyle={styles.locationText}
          />
          <ListItem
            title={Lang.t('myProfile.filterByDistance')}
            disabled={!player.locationPermission}
            hideChevron
            switchButton
            switched={player.filterByDistance}
            onSwitch={() => this._updateUser({ filterByDistance: !player.filterByDistance })}
          />
          <ListItem
            disabled={!player.locationPermission || !player.filterByDistance}
            hideChevron
            subtitle={Lang.t('myProfile.distance', { distance: player.distance })}
            subtitleStyle={styles.sliderLabel}
            title={<Slider
              disabled={!player.locationPermission || !player.filterByDistance}
              minimumTrackTintColor={Colors.primaryLight}
              minimumValue={1}
              maximumValue={30}
              onValueChange={(distance) => this._updateUser({ distance })}
              step={1}
              thumbTintColor={Colors.primary}
              value={player.distance}
            />}
          />
        </List>
      </View>
    )
  }

  _updateUser(data) {
    const player = Object.assign({}, this.state.player, data)
    this.setState({ player });
    this.props.onChange(player);
  }

  _getLocationText() {
    if (!this.state.player.locationPermission) {
      return Lang.t(`location.error.permissionDenied`);
    } else if (this.state.player.location) {
      const location = this.state.player.location
      return `${location.city}, ${location.country}`
    } else if (this.state.player.position) {
      const latlng = this.state.player.position.coords;
      const lat = latlng.latitude;
      const lng = latlng.longitude;
      return `${lat}, ${lng}`
    }

    return Lang.t('loading')
  }
}

const styles = StyleSheet.create({
  sliderLabel: {
    color: Colors.muted,
    fontSize: 14,
    alignSelf: 'center'
  },
  locationText: {
    color: Colors.muted
  },
  infoText: {
    color: Colors.text
  },
})
