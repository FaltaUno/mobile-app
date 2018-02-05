
import React from 'react';

import { DatePickerIOS } from 'react-native';
import { ListItem } from 'react-native-elements';

export default class ListItemDatePickerIOS extends React.Component {
  render() {
    return (
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
    )
  }
}
