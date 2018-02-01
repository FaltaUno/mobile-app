import React from 'react'
import { ScrollView } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import moment from 'moment'

export default class MatchesList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            matches: this.props.matches,
            player: this.props.player? this.props.player : {},
            onPress: this.props.onPress? this.props.onPress :  () => {} 
        }
    }

    render() {
        const displayMatches = this.state.matches
        const matchesKeys = Object.keys(displayMatches)
        return (
            <ScrollView>
                <List>
                    {matchesKeys.map((key) => {
                    const that = this;    
                    const match = displayMatches[key]
                    return (
                        <ListItem
                        key={key}
                        title={match.name}
                        subtitle={match.place}
                        hideChevron={this.props.hideChevron}
                        rightTitle={moment(match.date).calendar()}
                        onPress={ () => that.state.onPress(match, this.state.player) }
                        />
                    )
                    })}
                </List>
              </ScrollView>
        )
    }
}