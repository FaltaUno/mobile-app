
import React from 'react';

import { DatePickerAndroid, TimePickerAndroid, View } from 'react-native';
import { ListItem, Button } from 'react-native-elements';

// @todo: DO IT!
export default class ListItemDatePickerAndroid extends React.Component {
  render() {
    return (
      <ListItem
        hideChevron
        title={(
          <View>
            <Button title="Android DatePicker" onPress={() => this._handleAndroidDatePicker()} />
            <Button title="Android TimePicker" onPress={() => this._handleAndroidTimePicker()} />
          </View>
        )}
      />
    )
  }

  async _handleAndroidDatePicker() {
    try {
      const { action /*, year, month, day */ } = await DatePickerAndroid.open({
        date: this.state.chosenDate
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
      }
    } catch ({ code, message }) {
      // console.warn('Cannot open date picker', message);
    }
  }

  async _handleAndroidTimePicker() {
    try {
      const { action /*, hour, minute */ } = await TimePickerAndroid.open({
        hour: 14,
        minute: 0,
        is24Hour: false, // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // Selected hour (0-23), minute (0-59)
      }
    } catch ({ code, message }) {
      //console.warn('Cannot open time picker', message);
    }
  }
}
