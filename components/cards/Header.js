'use strict';

var React = require('react-native');
var {
  Text,
} = React;

var Header = React.createClass({
  displayName: "HeaderCard",
  render: function() {
    return (
      <Text style={this.props.cardCommonStyles.titles}>
        {this.props.data["Text"]}
      </Text>
    );
  }
});

module.exports = Header;
