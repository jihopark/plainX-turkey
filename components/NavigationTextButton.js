'use strict';

var React = require('react-native');
var {
  Text,
} = React;

var NavigationTextButton = React.createClass({
  getDefaultProps: () => {
    return {
      buttonText: "Back"
    };
  },
  render: function() {
    return(
      <Text style={[this.props.styles.navBarText, this.props.styles.navBarButtonText]}>
        {this.props.buttonText}
      </Text>
    );
  }
});

module.exports = NavigationTextButton;
