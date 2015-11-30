'use strict';

var React = require('react-native');
var {
  Text,
} = React;

var Empty = React.createClass({
  displayName: "EmptyCard",
  render: function() {
    return (
      <Text style={this.props.cardCommonStyles.description}>
        {this.props.data["Text"]}
      </Text>
    );
  }
});

module.exports = Empty;
