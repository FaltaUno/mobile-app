import React from 'react';

import { StyleSheet, Platform } from 'react-native';

import Lang from 'lang'
import Colors from 'constants/Colors';

import MyMatchesList from 'components/MyMatchesList';
import { Ionicons } from '@expo/vector-icons';

export default class MatchListScreen extends React.Component {
 
  state = {
    deleteMode: false
  }
  
  _setDeleteMode = () => {
    if(this.state.deleteMode === false) {
      this.setState({ deleteMode: true })
    } else {
      this.setState({ deleteMode: false })
    }
    
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleDeleteMode: this._setDeleteMode
  });
  }

  // Dynamic definition so we can get the actual Lang locale
  static navigationOptions = ({ navigation }) => { 
    const { params = {} } = navigation.state;   
    return {
      title: Lang.t('myMatches.title'),
      headerRight: (
        <Ionicons
          name={(Platform.OS === 'ios' ? 'ios' : 'md') + '-add'}
          size={36}
          style={styles.headerRightIconContainer}
          color={Colors.tintColor}
          onPress={() => navigation.navigate('AddMatch')}
        />
      ),    
      headerLeft: (
        <Ionicons
          name={(Platform.OS === 'ios' ? 'ios' : 'md') + '-trash'}
          size={36}
          style={styles.headerRightIconContainer}
          color={Colors.tintColor}
          onPress={ () => params.handleDeleteMode() }
        />
    )
  } 
}

  render() {
    return (
      <MyMatchesList onPress={(match) => this.props.navigation.navigate("AddMatch", {match: match})} 
      deleteMode={ this.state.deleteMode }  />
    )
  }
}

const styles = StyleSheet.create({
  headerRightIconContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
})
