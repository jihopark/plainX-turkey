'use strict';

var React = require('react-native');
var {
  View,
  TextInput,
  StyleSheet,
} = React;

var PlainTextInput = React.createClass({
  displayName: 'PlainTextInput',
  render: function() {
    return (
      <View style={styles.textContainer}>
        <TextInput style={styles.text}
          secureTextEntry={this.props.secureTextEntry || false}
          placeholder={this.props.placeholder}
          keyboardType={this.props.keyboardType}
          onChangeText={this.props.onChangeText}
          value={this.props.value} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  textContainer: {
    width: 200,
    height: 40,
    flexDirection: 'column',
    padding: 3,
    borderWidth: 1,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: '#33cc66',
    alignItems: 'center',
  },
  text: {
    width: 200,
    height: 30,
    fontSize: 60/3,
    color: '#33cc66',
  },
});

module.exports = PlainTextInput;
