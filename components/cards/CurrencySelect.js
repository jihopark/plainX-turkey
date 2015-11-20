'use strict';

var React = require('react-native');
var Rx = require('rx');
var CurrencySelectText = require('../CurrencySelectText.js');

var {
  View,
  Text,
  TouchableOpacity,
} = React;

var CurrencySelect = React.createClass({
  displayName: "CurrencySelectCard",
  render: function() {
    var subject = new Rx.Subject();
    if (this.props.observer) {
      subject.subscribe(this.props.observer);
    }
    var id = this.props.id;
    var currencyList = this.props.data["CurrencyList"];
    var next = {"id": id, "CurrencyList":currencyList};
    var sell = this.props.data["Sell"];
    var buy = this.props.data["Buy"];

    return (
      <View>
        <Text>I want to exchange</Text>
        <TouchableOpacity onPress={function(event) {
          next["Target"] = "Sell";
          next["CurrentCurrency"] = sell;
          subject.onNext(next);
        }}>
          <CurrencySelectText text={sell}/>
        </TouchableOpacity>

        <Text>TO</Text>

        <TouchableOpacity onPress={function(event) {
          next["Target"] = "Buy";
          next["CurrentCurrency"] = buy;
          subject.onNext(next);
        }}>
          <CurrencySelectText text={buy}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={function(event) {
          next["Target"] = "Button";
          next["Sell"] = sell;
          next["Buy"] = buy;
          subject.onNext(next);
        }}>
          <Text>SEARCH</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

module.exports = CurrencySelect;
