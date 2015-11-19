'use strict';

var React = require('react-native');

var {
  Text,
  View,
} = React;

var OfferSummary = React.createClass({
  displayName: "OfferSummaryCard",
  render: function() {
    return (
      <View>
        <Text>{this.props.data["TitleText"]}</Text>
        <Text>{this.props.data["Details"]}</Text>
        <Text>{this.props.data["DescriptionText"]}</Text>
      </View>
    );
  }
});

module.exports = OfferSummary;
