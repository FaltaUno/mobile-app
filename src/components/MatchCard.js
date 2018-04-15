import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { Card } from 'react-native-elements'
import { MapView } from 'expo'

export default class MatchCard extends Component {

  constructor(props) {
    super(props)
  }

  state = {
    loading: true,
    marker: false,
    region: {}
  }

  componentDidMount() {
    let marker = false
    const match = this.props.match
    
    let region = {
      latitude: match.location.lat,
      latitudeDelta: 0.0922,
      longitude: match.location.lng,
      longitudeDelta: 0.0421
    }
    
    marker = {
      coordinate: {
        latitude: region.latitude,
        longitude: region.longitude,
      }
    }

    this.setState({
      loading: false,
      region,
      marker,
    })
  }

  render() {
    const theMatch = this.props.match 
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      )
    } else {
      return(
        <Card title={ theMatch.name }>
          <MapView style={ styles.map }
            region={this.state.region} 
            onRegionChange={ (region) => this.setState({ region }) } 
          />
        </Card>
      ) 
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
})

