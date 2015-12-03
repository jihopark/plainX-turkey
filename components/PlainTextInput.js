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
    width: 300,
    height: 50,
    flexDirection: 'column',
    padding: 3,
    alignItems: 'center',
    backgroundColor: 'rgba(256,256,256,0.3)',
    marginBottom: 10,
  },
  text: {
    width: 300,
    height: 40,
    fontSize: 60/3,
    color: '#33cc66',
  },
});

module.exports = PlainTextInput;
