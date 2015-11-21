'use strict';

var React = require('react-native');
var {
  Text,
  TouchableOpacity,
} = React;

var ActionButton = React.createClass({
  displayName: 'ActionButton',
  render: function() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Text>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
});

module.exports = ActionButton;
