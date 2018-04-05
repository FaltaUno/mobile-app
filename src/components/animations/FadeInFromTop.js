import React from 'react';
import { Animated, Text, View, Easing } from 'react-native';

class FadeInFromTop extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),
    fromPosition: new Animated.Value(50)
  }

  componentDidMount() {
    Animated.parallel([
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: this.props.duration,
        delay: this.props.delay ? this.props.delay : 0
      }),
      Animated.timing(this.state.fromPosition, { 
        toValue: 0,
        delay: this.props.delay ? this.props.delay : 0 
      })
    ]).start();
  }

  render() {
    let { fadeAnim, fromPosition } = this.state;
    return (
      <Animated.View
        style={{
          ...this.props.style,
          opacity: fadeAnim,
          bottom: fromPosition
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

export default FadeInFromTop;