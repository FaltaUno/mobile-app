import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { ActivityIndicator, SectionList, StyleSheet, View } from "react-native";
import { ListItem, Text } from "react-native-elements";
import Lang from "lang";
import Colors from "constants/Colors";

export default class ApprovedPlayersList extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    inviteUsers: PropTypes.array.isRequired
  };

  state = {};

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={"large"} />
        </View>
      );
    }

    const sections = [];

    if (this.props.inviteUsers.length) {
      sections.push({
        title: Lang.t("approvedPlayersList.title"),
        data: this.props.inviteUsers
      });
    }

    return (
      <SectionList
        sections={sections}
        renderSectionHeader={this.handleRenderSectionHeader}
        keyExtractor={this.handleKeyExtractor}
        renderItem={({ item }) => this.handleRenderItem(item)}
        ListEmptyComponent={
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{Lang.t("approvedPlayersList.emptyList")}</Text>
          </View>
        }
      />
    );
  }
  handleKeyExtractor(inviteUsers) {
    const { user } = inviteUsers;
    return user.key;
  }

  handleRenderSectionHeader({ section }) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    );
  }

  handleRenderItem(inviteUsers) {
    const { invite, user } = inviteUsers;
    return (
      <ListItem
        containerStyle={styles.listItem}
        key={user.key}
        roundAvatar
        avatar={{ uri: user.photoURL }}
        title={user.displayName}
        subtitle={moment(invite.createdAt).calendar()}
        rightIcon={this.showActionButtons(invite, user)}
      />
    );
  }

  showActionButtons(invite, user) {
    return <View style={styles.actionsContainer} />;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 64
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
  },
  actionsContainer: {
    flexDirection: "row"
  }
});
