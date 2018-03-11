import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

import Colors from 'constants/Colors';

export default class CodeVerificationInput extends React.Component {

  _input = []

  state = {
    input: [null, null, null, null, null, null],
  }

  render() {

    const commonAttributes = {
      editable: !this.props.disabled,
      keyboardType: `numeric`,
      maxLength: 1,
      returnKeyLabel: `next`,
      selectTextOnFocus: true,
      style: styles.input,
      underlineColorAndroid: 'rgba(0,0,0,0)',
    }

    return (
      <View style={styles.row}>
        <TextInput {...commonAttributes} value={this.state.input[0]} ref={(input) => { this._input[0] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 0) }} placeholder={"1"} />
        <TextInput {...commonAttributes} value={this.state.input[1]} ref={(input) => { this._input[1] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 1) }} placeholder={"2"} />
        <TextInput {...commonAttributes} value={this.state.input[2]} ref={(input) => { this._input[2] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 2) }} placeholder={"3"} />
        <TextInput {...commonAttributes} value={this.state.input[3]} ref={(input) => { this._input[3] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 3) }} placeholder={"4"} />
        <TextInput {...commonAttributes} value={this.state.input[4]} ref={(input) => { this._input[4] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 4) }} placeholder={"5"} />
        <TextInput {...commonAttributes} value={this.state.input[5]} ref={(input) => { this._input[5] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 5) }} placeholder={"6"} />
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
