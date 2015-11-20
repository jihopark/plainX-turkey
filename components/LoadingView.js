'use strict';

var React = require('react-native');
var {
  Text,
  View,
} = React;

var LoadingView = React.createClass({
  displayName: 'LoadingView',
  render: function() {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
});

module.exports = LoadingView;
