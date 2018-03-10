
import React from 'react';
import Colors from 'constants/Colors';

import { Keyboard, StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';

export default class ListItemToggleComponent extends React.Component {
  state = {
    show: false
  }

  render() {
    if (!this.state.show) {
      return (
        <ListItem
          hideChevron
          title={this.props.title}
          rightTitle={this.props.rightTitle}
          rightTitleStyle={styles.infoText}
          onPress={() => this.show()}
        />
      )
    }

    Keyboard.dismiss()
    return (
      <View>
        <ListItem
          hideChevron
          title={this.props.activeTitle}
          titleStyle={styles.active}
          onPress={() => this.hide()}
        />
        <ListItem
          hideChevron
          title={this.props.component}
        />
      </View>
    )
  }

  show() {
    this.setState({ show: true })
  }

  hide() {
    this.setState({ show: false })
  }
}

const styles = StyleSheet.create({
  active: {
    color: Colors.tintColor
  },
  infoText: {
    color: Colors.muted,
    fontSize: 16,
  },
})
