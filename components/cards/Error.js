'use strict';

var React = require('react-native');
var {
  Text,
} = React;

var Error = React.createClass({
  displayName: "ErrorCard",
  render: function() {
    return (
      <Text style={this.props.cardCommonStyles.description}>
        {this.props.data ?
          this.props.data["Text"] :
          "Opps, this is embrassing. Something went wrong :("}
      </Text>
    );
  }
});

module.exports = Error;
