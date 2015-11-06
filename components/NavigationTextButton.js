'use strict';

var React = require('react-native');
var {
  Text,
  TouchableOpacity,
} = React;

var NavigationTextButton = React.createClass({
  getDefaultProps: () => {
    return {
      buttonText: "Back"
    };
  },
  render: function() {
    return(
      <TouchableOpacity onPress={this.props.onPress}>
        <Text>{this.props.buttonText}</Text>
      </TouchableOpacity>
    );
  }
});

module.exports = NavigationTextButton;
