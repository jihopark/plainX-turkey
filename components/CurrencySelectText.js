'use strict';

var React = require('react-native');

var {
  Text,
} = React;

var CurrencySelectText = React.createClass({
  render: function() {
    return (
      <Text>
        {this.props.text}
      </Text>
    );
  }
});


module.exports = CurrencySelectText;
