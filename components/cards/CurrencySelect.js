'use strict';

var React = require('react-native');
var Rx = require('rx');
var CurrencySelectText = require('../CurrencySelectText.js');
var CardButton = require('../CardButton.js');

var {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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
        <Text style={this.props.cardCommonStyles.titles}>
          I WANT TO EXCHANGE
        </Text>

        <View style={styles.currencyContainer}>

          <TouchableOpacity onPress={function(event) {
            next["Target"] = "Sell";
            next["CurrentCurrency"] = sell;
            subject.onNext(next);
          }}>
            <CurrencySelectText
              iconStyle={this.props.cardCommonStyles.triangleIconStyle}
              text={sell}/>
          </TouchableOpacity>

          <Text style={this.props.cardCommonStyles.titles, styles.to}>
            TO
          </Text>

          <TouchableOpacity onPress={function(event) {
            next["Target"] = "Buy";
            next["CurrentCurrency"] = buy;
            subject.onNext(next);
          }}>
            <CurrencySelectText
              iconStyle={this.props.cardCommonStyles.triangleIconStyle}
              text={buy}/>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={function(event) {
          next["Target"] = "Button";
          next["Sell"] = sell;
          next["Buy"] = buy;
          subject.onNext(next);
        }}>
          <CardButton text={"FIND OFFERS"} />
        </TouchableOpacity>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  currencyContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  to: {
    alignSelf:'center',
    marginLeft: 10,
    marginRight: 10,
  },
});

module.exports = CurrencySelect;
