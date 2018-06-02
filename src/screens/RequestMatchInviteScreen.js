import React, { Component } from 'react'
import { View } from 'react-native-elements'
import MatchCard from '../components/MatchCard'
import { headerStyle } from "constants/Theme";
import Lang from 'lang'

export default class RequestMatchInviteScreen extends Component {

  constructor(props) {
    super(props)
  }

  static navigationOptions = ({ navigation }) => ({
    title: Lang.t('invite.title', navigation.state.params.match),
    tabBarVisible: true,
    ...headerStyle
  });

  render() {
    return(
        <MatchCard match={ this.props.navigation.state.params.match } />
    )
  }

}
