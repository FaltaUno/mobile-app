
import React from 'react';

import Colors from 'constants/Colors';
import Lang from 'lang';
import moment from 'moment';

import { DatePickerAndroid, TimePickerAndroid, StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';

// @todo: DO IT!
export default class ListItemDatePickerAndroid extends React.Component {
  render() {
    return (
      <View>
        <ListItem
          hideChevron
          title={Lang.t(`addMatch.datePickerLabel`)}
          rightTitle={moment(this.props.date).format('D/M/YYYY')}
          rightTitleStyle={styles.infoText}
          onPress={() => this._handleAndroidDatePicker()}
        />
        <ListItem
          hideChevron
          title={Lang.t(`addMatch.timePickerLabel`)}
          rightTitle={moment(this.props.date).format('HH:mm')}
          rightTitleStyle={styles.infoText}
          onPress={() => this._handleAndroidTimePicker()}
        />
      </View>
    )
  }

  async _handleAndroidDatePicker() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: this.props.date
      });

      if (action !== DatePickerAndroid.dismissedAction) {
        let date = moment(this.props.date);
        date.year(year);
        date.month(month);
        date.date(day);
        this.props.onDateChange(date.toDate());
      }
    } catch ({ code, message }) {
      // eslint-disable-next-line no-console
      console.warn('Cannot open date picker', message);
    }
  }

  async _handleAndroidTimePicker() {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: this.props.date.getHours(),
        minute: this.props.date.getMinutes(),
        is24Hour: true,
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        let date = moment(this.props.date);
        date.hours(hour);
        date.minutes(minute);
        this.props.onDateChange(date.toDate());
      }
    } catch ({ code, message }) {
      // eslint-disable-next-line no-console
      console.warn('Cannot open time picker', message);
    }
  }
}

const styles = StyleSheet.create({
  datePickerActive: {
    color: Colors.tintColor
  },
  infoText: {
    color: Colors.muted,
    fontSize: 16,
  },
})
