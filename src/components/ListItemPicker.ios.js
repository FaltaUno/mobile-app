
import React from 'react';
import Colors from 'constants/Colors';

import { Keyboard, StyleSheet, View, Picker } from 'react-native';
import { ListItem } from 'react-native-elements';

export default class ListItemPickerIOS extends React.Component {
  static defaultProps = {
    activeTitle: null,
    items: [],
    onValueChange: () => {},
    ref: undefined,
    rightTitle: null,
    selectedValue: undefined,
    title: null,
  }

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
          title={(
            <Picker
              selectedValue={this.props.selectedValue}
              onValueChange={(itemValue) => this.props.onValueChange(itemValue)}>
              {this.props.items.map((item) => (<Picker.Item label={item.label} value={item.value} key={item.key} />))}
            </Picker>
          )}
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
