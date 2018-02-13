import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

import Colors from 'constants/Colors';

export default class CodeVerificationInput extends React.Component {

  _input = []

  state = {
    input: [null, null, null, null, null, null],
  }

  render() {
    return (
      <View style={styles.row}>
        <TextInput value={this.state.input[0]} editable={!this.props.disabled} ref={(input) => { this._input[0] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 0) }} keyboardType={`default`} maxLength={1} returnKeyLabel={`next`} selectTextOnFocus={true} style={styles.input} placeholder={"1"} />
        <TextInput value={this.state.input[1]} editable={!this.props.disabled} ref={(input) => { this._input[1] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 1) }} keyboardType={`default`} maxLength={1} returnKeyLabel={`next`} selectTextOnFocus={true} style={styles.input} placeholder={"2"} />
        <TextInput value={this.state.input[2]} editable={!this.props.disabled} ref={(input) => { this._input[2] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 2) }} keyboardType={`default`} maxLength={1} returnKeyLabel={`next`} selectTextOnFocus={true} style={styles.input} placeholder={"3"} />
        <TextInput value={this.state.input[3]} editable={!this.props.disabled} ref={(input) => { this._input[3] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 3) }} keyboardType={`default`} maxLength={1} returnKeyLabel={`next`} selectTextOnFocus={true} style={styles.input} placeholder={"4"} />
        <TextInput value={this.state.input[4]} editable={!this.props.disabled} ref={(input) => { this._input[4] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 4) }} keyboardType={`default`} maxLength={1} returnKeyLabel={`next`} selectTextOnFocus={true} style={styles.input} placeholder={"5"} />
        <TextInput value={this.state.input[5]} editable={!this.props.disabled} ref={(input) => { this._input[5] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 5) }} keyboardType={`default`} maxLength={1} returnKeyLabel={`next`} selectTextOnFocus={true} style={styles.input} placeholder={"6"} />
      </View>
    )
  }

  clear() {
    this.setState({
      input: [null, null, null, null, null, null]
    })
  }

  checkTextAndFocus(text, index) {
    let input = this.state.input.slice(0);
    input[index] = text;
    this.setState({ input })
    if (text.length) {
      if (index !== 5) {
        this._input[index + 1].focus()
      }

      let code = input.join('')
      if (code.length === this.state.input.length) {
        this.props.onFinish(code);
      }
    }
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  input: {
    fontSize: 24,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: Colors.muted,
    padding: 10,
  },
})
