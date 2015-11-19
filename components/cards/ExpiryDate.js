'use strict';

var React = require('react-native');

var {
  Text,
  View,
} = React;

var ExpiryDate = React.createClass({
  displayName: "ExpiryDateCard",
  render: function() {
    return (
      <View>
        <Text>{this.props.data["TitleText"]}</Text>
        <Text>{this.props.data["Date"]}</Text>
      </View>
    );
  }
});

module.exports = ExpiryDate;
