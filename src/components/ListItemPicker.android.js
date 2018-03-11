
import React from 'react';
import { Picker } from 'react-native';

export default class ListItemPickerAndroid extends React.Component {
  static defaultProps = {
    activeTitle: null,
    items: [],
    onValueChange: () => {},
    ref: undefined,
    rightTitle: null,
    selectedValue: undefined,
    title: null,
  }

  render() {
    return (
      <Picker
        selectedValue={this.props.selectedValue}
        onValueChange={(itemValue) => this.props.onValueChange(itemValue)}>
        {this.props.items.map((item) => (
          <Picker.Item label={item.label} value={item.value} key={item.key} />
        ))}
      </Picker>
    )
  }

  // Noop methods used by the iOS component for show/hide the datepicker when
  // getting into another field
  show() { }
  hide() { }
}
