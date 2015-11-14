'use strict';

var React = require('react-native');
var {
  Text,
} = React;

var Explanation = React.createClass({
  displayName: "ExplanationCard",
  render: function() {
    return (
      <Text>{this.props.data["Text"]}</Text>
    );
  }
});

module.exports = Explanation;
