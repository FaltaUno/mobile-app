import React from "react";

import { StyleSheet, Text } from "react-native";

import Lang from "lang";
import Colors from "constants/Colors";

import MyMatchesList from "components/MyMatchesList";

export default class MyMatchesScreen extends React.Component {
  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    let navigationOptions = {
      title: Lang.t("myMatches.title"),
      headerLeft: (
        <Text
          style={styles.headerButton}
          onPress={() => navigation.setParams({ deleteMode: true })}
        >
          {Lang.t("action.edit")}
        </Text>
      ),
      headerRight: (
        <Text
          style={styles.headerButton}
          onPress={() => navigation.navigate("AddMatch")}
        >
          {Lang.t("action.add")}
        </Text>
      )
    };

    if (params.hideDeleteModeButton === true) {
      navigationOptions.headerLeft = null;
    } else if (params.deleteMode) {
      navigationOptions.headerLeft = (
        <Text
          style={styles.headerButton}
          onPress={() => navigation.setParams({ deleteMode: false })}
        >
          {Lang.t("action.done")}
        </Text>
      );
      delete navigationOptions.headerRight;
    }

    return navigationOptions;
  };

  render() {
    let { params = {} } = this.props.navigation.state;
    const { deleteMode = false } = params;
    return (
      <MyMatchesList
        onPress={match => this.props.navigation.navigate("MyMatch", { match })}
        deleteMode={deleteMode}
        onMatchDidUpdate={matches => this.disableDeleteMode(matches)}
        onMatchesDidLoad={matches => this.handleMatchesLoad(matches)}
      />
    );
  }

  handleMatchesLoad(matches) {
    const listIsEmpty = Object.values(matches).length === 0;
    let { params = {} } = this.props.navigation.state;
    let { deleteMode = false, hideDeleteModeButton = false } = params;

    if (listIsEmpty) {
      hideDeleteModeButton = true;
      if (deleteMode) {
        deleteMode = false;
      }
    } else {
      hideDeleteModeButton = false;
    }
    this.props.navigation.setParams({
      hideDeleteModeButton,
      deleteMode
    });
  }

  disableDeleteMode(matches) {
    const deleteMode = false;
    const hideDeleteModeButton = Object.values(matches).length === 0;
    this.props.navigation.setParams({ deleteMode, hideDeleteModeButton });
  }
}

const styles = StyleSheet.create({
  headerButton: {
    color: Colors.tintColor,
    fontSize: 16,
    marginLeft: 15,
    marginRight: 15
  }
});
