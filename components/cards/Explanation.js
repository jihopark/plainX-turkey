'use strict';

var React = require('react-native');
var {
  Text,
} = React;

var Explanation = React.createClass({
  displayName: "ExplanationCard",
  render: function() {
    return (
      <Text style={[this.props.cardCommonStyles.explanation,{textAlign:'center'}]}>
        {this.props.data["Text"]}
      </Text>
    );
  }
});

module.exports = Explanation;
