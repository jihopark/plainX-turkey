'use strict';

var React = require('react-native');
var Rx = require('rx');
var CurrencySelectText = require('../CurrencySelectText.js');

var {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} = React;

var CurrencyAmountSelect = React.createClass({
  displayName: "CurrencyAmountSelectCard",
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
    var sellAmount = this.props.data["SellAmount"];
    var buyAmount = this.props.data["BuyAmount"];
    var canEditCurrency = true;

    return (
      <View>
        <Text>Step 1: How much do you wish to exchange?</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={function(num){
            next["Target"] = "SellAmount";
            next["SellAmount"] = num;
            subject.onNext(next);
          }}
          onFocus={function() {
            next["Target"] = "Focus";
            subject.onNext(next);
          }}
          value={sellAmount}
          keyboardType={"numeric"}
          clearTextOnFocus={true}
          returnKeyType={'done'}
        />

        <TouchableOpacity onPress={function(event) {
          if (!canEditCurrency) return ;
          next["Target"] = "Sell";
          next["CurrentCurrency"] = sell;
          subject.onNext(next);
        }}>
          <CurrencySelectText text={sell}/>
        </TouchableOpacity>

        <Text>Exchange To</Text>

        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={function(num){
            next["Target"] = "BuyAmount";
            next["BuyAmount"] = num;
            subject.onNext(next);
          }}
          onFocus={function() {
            next["Target"] = "Focus";
            subject.onNext(next);
          }}
          value={buyAmount}
          clearTextOnFocus={true}
          returnKeyType={'done'}
          keyboardType={"numeric"}
        />

        <TouchableOpacity onPress={function(event) {
          if (!canEditCurrency) return ;
          next["Target"] = "Buy";
          next["CurrentCurrency"] = buy;
          subject.onNext(next);
        }}>
          <CurrencySelectText text={buy}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={function(event) {
          next["Target"] = "Next";
          subject.onNext(next);
        }}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

module.exports = CurrencyAmountSelect;
