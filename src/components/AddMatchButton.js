import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from 'react-native-elements'
import { withNavigation } from 'react-navigation'

import Lang from 'lang'
import Colors from 'constants/Colors';

@withNavigation
export default class AddMatchButton extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <View style={styles.container} >
                <Button
                title={Lang.t(`matchList.addMatch`)}
                containerViewStyle={styles.addMatchButtonContainer}
                backgroundColor={Colors.primary}
                onPress={() => this.props.navigation.navigate("CreateMatch")} />
            </View>
        ) 
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    addMatchButtonContainer: {
        bottom: 0,
        marginLeft: 0,
        position: 'absolute',
        width: '100%',
      }
})