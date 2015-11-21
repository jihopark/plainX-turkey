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
  getDynamicRateExplanation: (rate) => {
    return rate ? (<Text>{"*Based on today's market rate:" + rate}</Text>) : null;
  },
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
    var AmountSell = this.props.data["AmountSell"]+"";
    var AmountBuy = this.props.data["AmountBuy"]+"";
    var canEditCurrency = true;

    return (
      <View>
        <Text>{this.props.data["TitleText"]}</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={function(num){
            next["Target"] = "AmountSell";
            next["AmountSell"] = num;
            subject.onNext(next);
          }}
          onFocus={function() {
            next["Target"] = "Focus";
            subject.onNext(next);
          }}
          value={AmountSell}
          keyboardType={"numeric"}
          clearTextOnFocus={true}
          returnKeyType={'done'}
        />
        {this.getDynamicRateExplanation(this.props.data["SellRate"])}

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
            next["Target"] = "AmountBuy";
            next["AmountBuy"] = num;
            subject.onNext(next);
          }}
          onFocus={function() {
            next["Target"] = "Focus";
            subject.onNext(next);
          }}
          value={AmountBuy}
          clearTextOnFocus={true}
          returnKeyType={'done'}
          keyboardType={"numeric"}
        />
        {this.getDynamicRateExplanation(this.props.data["BuyRate"])}

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
        </TouchableOpacity>
      </View>
    );
  }
});

module.exports = CurrencyAmountSelect;
