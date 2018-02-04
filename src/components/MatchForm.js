import React from 'react';
import {
  DatePickerAndroid,
  DatePickerIOS,
  Platform,
  StyleSheet,
  TimePickerAndroid,
  View,
} from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';

import Lang from 'lang'

export default class MatchForm extends React.Component {
  state = {
    match: {
      name: null,
      place: null,
      date: new Date(),
    },
    chosenDate: null,
    chosenTime: null,
  }

  render() {
    let datePicker;
    if (Platform.OS === 'ios') {
      datePicker = (
        <DatePickerIOS
          date={this.state.match.date}
          minimumDate={new Date()}
          minuteInterval={15}
          onDateChange={(date) => this._update({ date })}
          locale={Lang.currentLocale()}
        />
      )
    } else {
      datePicker = (
        <View>
          <Button title="Android DatePicker" onPress={() => this._handleAndroidDatePicker()} />
          <Button title="Android TimePicker" onPress={() => this._handleAndroidTimePicker()} />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <FormLabel>{Lang.t(`addMatch.nameLabel`)}</FormLabel>
        <FormInput onChangeText={(name) => this._update({ name })} />
        <FormLabel>{Lang.t(`addMatch.placeLabel`)}</FormLabel>
        <FormInput onChangeText={(place) => this._update({ place })} />
        <FormLabel>{Lang.t(`addMatch.dateLabel`)}</FormLabel>
        {datePicker}
      </View>
    )
  }

  _update(data){
    const match = Object.assign({}, this.state.match, data);
    this.setState({ match });
    // Trigger the onChange event
    this.props.onChange(match);
  }

  async _handleAndroidDatePicker() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: this.state.chosenDate
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  async _handleAndroidTimePicker() {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: 14,
        minute: 0,
        is24Hour: false, // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // Selected hour (0-23), minute (0-59)
      }
    } catch ({ code, message }) {
      console.warn('Cannot open time picker', message);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
