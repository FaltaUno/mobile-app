import React from 'react';
import { Animated, Text, View } from 'react-native';

class SpringView extends React.Component {
  state = {
    springAnim: new Animated.Value(0.3),
  }

  componentDidMount() {
    Animated.spring(
      this.state.springAnim,
      {
        toValue: 1,
        friction: 1
      }
    ).start();
  }

  render() {
    let { springAnim } = this.state;

    return (
      <Animated.View style={{ ...this.props.style }}>
        {this.props.children}
      </Animated.View>
    );
  }
}

export default SpringView;