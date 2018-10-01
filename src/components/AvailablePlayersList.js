import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { ActivityIndicator, SectionList, StyleSheet, View } from "react-native";
import { ListItem, Text } from "react-native-elements";
import Lang from "lang";
import Colors from "constants/Colors";

export default class AvailablePlayersList extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    players: PropTypes.array.isRequired
  };

  state = {};

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <SectionList
        sections={[
          {
            title: Lang.t("availablePlayerList.title"),
            data: this.props.players
          }
        ]}
        renderSectionHeader={this.handleRenderSectionHeader}
        keyExtractor={this.handleKeyExtractor}
        renderItem={({ item }) => this.handleRenderItem(item)}
      />
    );
  }
  handleKeyExtractor(item) {
    return item.key;
  }

  handleRenderSectionHeader({ section }) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    );
  }

  handleRenderItem(player) {
    return (
      <ListItem
        containerStyle={styles.listItem}
        key={player.key}
        roundAvatar
        avatar={{ uri: player.photoURL }}
        title={player.displayName}
        subtitle={moment(player.createdAt).calendar()}
      />
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 24
  },
  sectionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteTransparent
  },
  sectionTitle: {
    color: Colors.dark,
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 24,
    opacity: 0.8
  },
  listItem: {
    backgroundColor: Colors.white
  }
});
