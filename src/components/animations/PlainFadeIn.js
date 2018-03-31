import React from 'react';
import { Animated, Text, View, Easing } from 'react-native';

class PlainFadeIn extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),
  }

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: this.props.duration,
        delay: this.props.delay ? this.props.delay : 0
      }
    ).start();
  }

  render() {
    let { fadeAnim } = this.state;

    return (
      <Animated.View
        style={{
          ...this.props.style,
          opacity: fadeAnim,
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

export default PlainFadeIn;