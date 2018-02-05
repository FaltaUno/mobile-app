import React from 'react';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import { List, ListItem, FormInput } from 'react-native-elements';

import moment from 'moment'
import Lang from 'lang'
import Colors from 'constants/Colors';

import ListItemDatePicker from './ListItemDatePicker.ios';

export default class MatchForm extends React.Component {
  state = {
    match: {
      name: null,
      place: null,
      date: new Date(),
      notes: null,
    },
    chosenDate: null,
    chosenTime: null,
    showDatePicker: false,
  }

  render() {
    let datePicker = (
      <ListItem
        hideChevron
        title={Lang.t(`addMatch.dateLabel`)}
        rightTitle={moment(this.state.match.date).format('ddd D/M/YY HH:mm')}
        rightTitleStyle={styles.infoText}
        onPress={() => this.setState({ showDatePicker: true })}
      />
    )

    let datePickerComponent;

    if (this.state.showDatePicker) {
      Keyboard.dismiss()
      datePicker = (
        <ListItem
          hideChevron
          title={moment(this.state.match.date).format('LLLL')}
          titleStyle={styles.datePickerActive}
          onPress={() => this.setState({ showDatePicker: false })}
        />
      )

      datePickerComponent = (
        <ListItemDatePicker
          date={this.state.match.date}
          minimumDate={new Date()}
          minuteInterval={15}
          onDateChange={(date) => this._update({ date })}
          locale={Lang.currentLocale()}
        />
      )
    }

    return (
      <View style={styles.container}>
        <List>
          <ListItem
            hideChevron
            containerStyle={styles.listItemFullInputTextWrapper}
            titleStyle={styles.listItemFullInputText}
            title={(
              <FormInput
                containerStyle={styles.listItemFullInputTextContainer}
                inputStyle={styles.listItemFullInputText}
                placeholder={Lang.t('addMatch.nameLabel')}
                onChange={(name) => this._update({ name })}
                onFocus={() => this.setState({ showDatePicker: false })}
              />
            )}
          />
        </List>
        <List>
          {datePicker}
          {datePickerComponent}
          <ListItem
            hideChevron
            title={Lang.t(`addMatch.placeLabel`)}
            textInput
            textInputStyle={styles.infoText}
            textInputContainerStyle={styles.fullInput}
            onChange={(place) => this._update({ place })}
            onPress={() => this.setState({ showDatePicker: false })}
            textInputOnFocus={() => this.setState({ showDatePicker: false })}
          />
        </List>
        <List>
          <ListItem
            hideChevron
            title={Lang.t(`addMatch.notesLabel`)}
            containerStyle={styles.listItemTextAreaContainer}
            subtitle={(
              <TextInput
                style={styles.listItemTextArea}
                multiline={true}
                onChange={(notes) => this._update({ notes })}
                onFocus={() => this.setState({ showDatePicker: false })}
              />
            )}
          />
        </List>
      </View>
    )
  }

  _update(data) {
    const match = Object.assign({}, this.state.match, data);
    this.setState({ match });
    // Trigger the onChange event
    this.props.onChange(match);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItemFullInputTextWrapper: {
    paddingBottom: 5,
    paddingTop: 5,
  },
  listItemFullInputTextContainer: {
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 0,
  },
  listItemFullInputText: {
    color: Colors.text
  },
  listItemTextAreaContainer: {
    minHeight: 75,
  },
  listItemTextArea: {
    color: Colors.muted,
    fontSize: 16,
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10,
  },
  infoText: {
    color: Colors.muted,
    fontSize: 16,
  },
  datePickerActive: {
    color: Colors.tintColor
  }
})
