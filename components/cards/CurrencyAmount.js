'use strict';

var React = require('react-native');

var {
  Text,
  View,
} = React;

var CurrencyAmount = React.createClass({
  displayName: "CurrencyAmountCard",
  render: function() {
    return (
      <View>
        <Text>{this.props.data["TitleText"]}</Text>
        <Text>{this.props.data["Sell"]} {this.props.data["AmountSell"]} to {this.props.data["Buy"]} {this.props.data["AmountBuy"]}</Text>
      </View>
    );
  }
});

module.exports = CurrencyAmount;
