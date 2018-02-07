
import React from 'react';
import Colors from 'constants/Colors';
import Lang from 'lang';
import moment from 'moment';

import { Keyboard, DatePickerIOS, StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';

export default class ListItemDatePickerIOS extends React.Component {
  state = {
    showDatePicker: false
  }

  render() {
    if (!this.state.showDatePicker) {
      return (
        <ListItem
          hideChevron
          title={Lang.t(`addMatch.dateLabel`)}
          rightTitle={moment(this.props.date).format('ddd D/M/YY HH:mm')}
          rightTitleStyle={styles.infoText}
          onPress={() => this.setState({ showDatePicker: true })}
        />
      )
    }

    Keyboard.dismiss()
    return (
      <View>
        <ListItem
          hideChevron
          title={moment(this.props.date).format('LLLL')}
          titleStyle={styles.datePickerActive}
          onPress={() => this.setState({ showDatePicker: false })}
        />
        <ListItem
          hideChevron
          title={<DatePickerIOS
            date={this.props.date}
            minimumDate={this.props.minimumDate}
            minuteInterval={this.props.minuteInterval}
            onDateChange={(date) => this.props.onDateChange(date)}
            locale={this.props.locale}
          />}
        />
      </View>
    )
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
