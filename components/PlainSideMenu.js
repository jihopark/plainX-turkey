'use strict';

var React = require('react-native');
const Dimensions = require('Dimensions');

var {
  View,
  StyleSheet,
  Text,
} = React;

const window = Dimensions.get('window');

var PlainSideMenu = React.createClass({
  displayName: 'PlainSideMenu',
  render: function() {
    console.log("PlainSIDE");
    return (
      <View style={styles.container}>
        <Text>Hi</Text>
        <Text>There</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: window.width,
    height: window.height,
    flexDirection: 'column',
    paddingTop: 20,
  },
});

module.exports = PlainSideMenu;
