import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { List, ListItem, Input } from 'react-native-elements';

import Lang from 'lang'
import Colors from 'constants/Colors';

// eslint-disable-next-line import/extensions, import/no-unresolved
import ListItemDatePicker from './ListItemDatePicker';

export default class MatchForm extends React.Component {
  state = {
    match: {
      name: null,
      place: null,
      date: new Date(),
      notes: null,
    },
  }

  render() {
    return (
      <View style={styles.container}>
        <List>
          <ListItem
            hideChevron
            containerStyle={styles.listItemFullInputTextWrapper}
            titleStyle={styles.listItemFullInputText}
            title={(
              <Input
                value={this.props.match.name} 
                containerStyle={styles.listItemFullInputTextContainer}
                inputStyle={styles.listItemFullInputText}
                placeholder={Lang.t('addMatch.nameLabel')}
                onChangeText={(name) => this._update({ name })}
                onFocus={() => this._datepicker.hide()}
              />
            )}
          />
        </List>
        <List>
          <ListItemDatePicker
            ref={(c) => { this._datepicker = c }}
            date={new Date(this.props.match.date)}
            minuteInterval={15}
            onDateChange={(date) => this._update({ date: date.getTime() })}
            locale={Lang.currentLocale()}
          />
          <ListItem
            hideChevron
            title={Lang.t(`addMatch.placeLabel`)}
            textInput
            textInputValue={this.props.match.place}
            textInputStyle={styles.infoText}
            textInputContainerStyle={styles.fullInput}
            textInputOnChangeText={(place) => this._update({ place })}
            onPress={() => this._datepicker.hide()}
            textInputOnFocus={() => this._datepicker.hide()}
          />
        </List>
        <List>
          <ListItem
            hideChevron
            title={Lang.t(`addMatch.notesLabel`)}
            containerStyle={styles.listItemTextAreaContainer}
            onPress={() => this._datepicker.hide()}
            subtitle={(
              <TextInput
                value={this.props.match.notes} 
                style={styles.listItemTextArea}
                multiline={true}
                onChangeText={(notes) => this._update({ notes })}
                onFocus={() => this._datepicker.hide()}
              />
            )}
          />
        </List>
      </View>
    )
  }

  _update(data) {
    const match = Object.assign({}, this.props.match, data);
    // Trigger the onChange event
    this.props.onChange(match);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItemFullInputTextWrapper: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  listItemFullInputTextContainer: {
    marginLeft: 0,
    marginRight: 0,
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
  }
})
