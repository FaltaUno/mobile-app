import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { List, ListItem, Input } from "react-native-elements";

import Lang from "lang";
import Colors from "constants/Colors";

// eslint-disable-next-line import/extensions, import/no-unresolved
import ListItemDatePicker from "./ListItemDatePicker";

export default class MatchForm extends React.Component {
  static defaultProps = {
    onChange: () => {},
    onPlacePress: () => {}
  };

  render() {
    const { match } = this.props;
    return (
      <View style={styles.container}>
        <List>
          <ListItem
            hideChevron
            containerStyle={styles.listItemFullInputTextWrapper}
            titleStyle={styles.listItemFullInputText}
            title={
              <Input
                value={match.name}
                containerStyle={styles.listItemFullInputTextContainer}
                inputStyle={styles.listItemFullInputText}
                placeholder={Lang.t("addMatch.nameLabel")}
                onChangeText={name => this._update({ name })}
                onFocus={() => this._datepicker.hide()}
              />
            }
          />
        </List>
        <List>
          <ListItem
            hideChevron
            textInput
            textInputValue={
              match.players.needed > 0 ? match.players.needed.toString() : ""
            }
            textInputPlaceholder={Lang.t(`addMatch.playersNeededPlaceholder`)}
            textInputKeyboardType={`numeric`}
            title={Lang.t(
              match.players.needed === 1
                ? `addMatch.playerNeededLabel`
                : `addMatch.playersNeededLabel`
            )}
            textInputOnChangeText={needed =>
              this._updatePlayersNeeded({ needed })
            }
            textInputOnFocus={() => this._datepicker.hide()}
          />
          <ListItemDatePicker
            ref={c => {
              this._datepicker = c;
            }}
            date={new Date(match.date)}
            minuteInterval={15}
            onDateChange={date => this._update({ date: date.getTime() })}
            locale={Lang.currentLocale()}
          />
          <ListItem
            title={Lang.t(`addMatch.placeLabel`)}
            rightTitle={
              match.place ? match.place : Lang.t(`addMatch.placePlaceholder`)
            }
            rightTitleStyle={styles.infoText}
            onPress={() => this.props.onPlacePress(match)}
            textInputOnFocus={() => this._datepicker.hide()}
          />
        </List>
        <List>
          <ListItem
            hideChevron
            title={Lang.t(`addMatch.notesLabel`)}
            containerStyle={styles.listItemTextAreaContainer}
            onPress={() => this._datepicker.hide()}
            subtitle={
              <TextInput
                value={match.notes}
                style={styles.listItemTextArea}
                multiline={true}
                onChangeText={notes => this._update({ notes })}
                onFocus={() => this._datepicker.hide()}
              />
            }
          />
        </List>
      </View>
    );
  }

  _update(data) {
    const match = Object.assign({}, this.props.match, data);
    // Trigger the onChange event
    this.props.onChange(match);
  }

  _updatePlayersNeeded(players) {
    const match = Object.assign({}, this.props.match);
    match.players = Object.assign({}, match.players, players);

    const { needed } = match.players;
    match.players.needed = needed < 1 ? 0 : parseInt(needed);

    this.props.onChange(match);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listItemFullInputTextWrapper: {
    paddingBottom: 0,
    paddingTop: 0
  },
  listItemFullInputTextContainer: {
    marginLeft: 0,
    marginRight: 0,
    borderBottomWidth: 0
  },
  listItemFullInputText: {
    color: Colors.text
  },
  listItemTextAreaContainer: {
    minHeight: 75
  },
  listItemTextArea: {
    color: Colors.muted,
    fontSize: 16,
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10
  },
  infoText: {
    color: Colors.muted,
    fontSize: 16
  }
});
