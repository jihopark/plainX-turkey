'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Text,
} = React;

var API_DOMAIN = 'https://plainexchange.herokuapp.com/api/v1/';

var body = React.createClass({
  render: function() {
    return (
      <Text>Hello world</Text>
    );
  }
});
AppRegistry.registerComponent('plainX', () => body);
