'use strict';

var React = require('react-native');
var Rx = require('rx');
var CurrencySelectText = require('../CurrencySelectText.js');
var Divider = require('../Divider.js');
var CurrencyAmountTextInput = require('../CurrencyAmountTextInput.js');

var {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} = React;

var CurrencyAmountSelect = React.createClass({
  displayName: "CurrencyAmountSelectCard",
  getDynamicRateExplanation: function(rate) {
    return rate ? (
      <Text style={this.props.cardCommonStyles.headings}>
        {"*Based on today's market rate:" + rate}
      </Text>) :
      null;
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
        <Text style={[this.props.cardCommonStyles.titles, {marginBottom: 5}]}>
          {this.props.data["TitleText"]}
        </Text>

        <Divider />
        <View style={{flexDirection: 'column', alignItems:'center'}}>
          <View style={styles.row}>
            <CurrencyAmountTextInput
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
            />

            <TouchableOpacity onPress={function(event) {
              if (!canEditCurrency) return ;
              next["Target"] = "Sell";
              next["CurrentCurrency"] = sell;
              subject.onNext(next);
            }}>
              <CurrencySelectText text={sell}/>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            {this.getDynamicRateExplanation(this.props.data["SellRate"])}
          </View>
          <View style={styles.row}>
            <Image style={styles.centerImage} source={require('../../assets/plane.png')}/>
            <Text style={this.props.cardCommonStyles.headings}>
              EXCHANGE TO:</Text>
          </View>
          <View style={styles.row}>
            <CurrencyAmountTextInput
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
            />
            <TouchableOpacity onPress={function(event) {
              if (!canEditCurrency) return ;
              next["Target"] = "Buy";
              next["CurrentCurrency"] = buy;
              subject.onNext(next);
            }}>
              <CurrencySelectText text={buy}/>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            {this.getDynamicRateExplanation(this.props.data["BuyRate"])}
          </View>
        </View>
        <TouchableOpacity onPress={function(event) {
          next["Target"] = "Next";
          subject.onNext(next);
        }}>
        </TouchableOpacity>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 10,
  },
  centerImage: {
    marginTop: 3,
    marginRight: 5,
    width: 20,
    height: 12,
    resizeMode: 'stretch',
    alignSelf: 'center'
  },
});


module.exports = CurrencyAmountSelect;
