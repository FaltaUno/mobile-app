import React, { Component } from "react";
import MatchCard from "../components/MatchCard";
import { headerStyle } from "constants/Theme";

export default class RequestMatchInviteScreen extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.match.name,
    tabBarVisible: true,
    ...headerStyle
  });

  render() {
    return <MatchCard match={this.props.navigation.state.params.match} />;
  }
}
