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
    var currencyA = this.props.data["CurrencyA"];
    var currencyB = this.props.data["CurrencyB"];

    return (
      <View>
        <Text>I want to exchange</Text>
        <TouchableOpacity onPress={function(event) {
          next["Target"] = "CurrencyA";
          next["CurrentCurrency"] = currencyA;
          subject.onNext(next);
        }}>
          <CurrencySelectText text={currencyA}/>
        </TouchableOpacity>

        <Text>TO</Text>

        <TouchableOpacity onPress={function(event) {
          next["Target"] = "CurrencyB";
          next["CurrentCurrency"] = currencyB;
          subject.onNext(next);
        }}>
          <CurrencySelectText text={currencyB}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={function(event) {
          next["Target"] = "Button";
          subject.onNext(next);
        }}>
          <Text>SEARCH</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

module.exports = CurrencySelect;
