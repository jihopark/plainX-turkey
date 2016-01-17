'use strict';

var React = require('react-native');
var {
  View,
  TextInput,
  Image,
  StyleSheet,
} = React;

var PlainTextInput = React.createClass({
  displayName: 'PlainTextInput',
  render: function() {
    return (
      <View style={styles.textContainer}>
        <Image source={this.props.icon} style={styles.icon}/>
        <TextInput style={styles.text}
          autoCapitalize={'none'}
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
    width: 652/2,
    height: 110/2,
    flexDirection: 'row',
    padding: 3,
    alignItems: 'center',
    backgroundColor: 'rgba(256,256,256,0.3)',
    marginBottom: 10,
  },
  text: {
    alignSelf: 'center',
    width: 300,
    height: 40,
    fontSize: 18,
    color: '#333333',
  },
  icon: {
    marginLeft: 20,
    marginRight: 20,
    alignSelf: 'center',
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

module.exports = PlainTextInput;
