import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

import Colors from 'constants/Colors';
import PlainFadeIn from './animations/PlainFadeIn';

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

    /** TODO: About the animation: Should be a component that handle the whole animation in a sequence 
     * and receive a prop whit the fisrt delay and then add 100 to that delay. Instad of a multiple
     * plain fades. 
     */
    return (
      <View style={styles.row}>
        <PlainFadeIn delay={400}>
          <TextInput {...commonAttributes} value={this.state.input[0]} ref={(input) => { this._input[0] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 0) }} placeholder={"1"} />
        </PlainFadeIn>
        <PlainFadeIn delay={550}>
          <TextInput {...commonAttributes} value={this.state.input[1]} ref={(input) => { this._input[1] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 1) }} placeholder={"2"} />
        </PlainFadeIn>
        <PlainFadeIn delay={700}>
          <TextInput {...commonAttributes} value={this.state.input[2]} ref={(input) => { this._input[2] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 2) }} placeholder={"3"} />
        </PlainFadeIn>
        <PlainFadeIn delay={850}>
          <TextInput {...commonAttributes} value={this.state.input[3]} ref={(input) => { this._input[3] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 3) }} placeholder={"4"} />
        </PlainFadeIn>
        <PlainFadeIn delay={1000}>
          <TextInput {...commonAttributes} value={this.state.input[4]} ref={(input) => { this._input[4] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 4) }} placeholder={"5"} />
        </PlainFadeIn>
        <PlainFadeIn delay={1150}>
          <TextInput {...commonAttributes} value={this.state.input[5]} ref={(input) => { this._input[5] = input }} onChangeText={(text) => { this.checkTextAndFocus(text, 5) }} placeholder={"6"} />
        </PlainFadeIn>
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
