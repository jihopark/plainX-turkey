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
  Platform,
} = React;

var CurrencyPicker = (Platform.OS === 'ios') ? require('../CurrencyPicker.ios.js') : require('../CurrencyPicker.android.js');


var CurrencyAmountSelect = React.createClass({
  displayName: "CurrencyAmountSelectCard",
  getDynamicRateExplanation: function(rate) {
    return rate ? (
      <Text style={this.props.cardCommonStyles.headings}>
        {"*Based on today's market rate:" + rate}
      </Text>) :
      null;
  },
  getInitialState: function() {
    return {
      showSellCurrencyPicker: false,
      showBuyCurrencyPicker: false,
      selectedSellCurrency: null,
      selectedBuyCurrency: null,
    }
  },
  dismissPicker: function() {
    this.setState({showSellCurrencyPicker: false, showBuyCurrencyPicker: false});
  },
  onPressSell: function(event) {
    this.setState({showBuyCurrencyPicker: false, showSellCurrencyPicker: true, selectedSellCurrency: this.props.data["Sell"]});
  },
  onPressBuy: function(event) {
    this.setState({showSellCurrencyPicker: false, showBuyCurrencyPicker: true, selectedBuyCurrency: this.props.data["Buy"]});
  },
  onSellPickerValueChange: function(value) {
    this.setState({selectedSellCurrency: value});
  },
  onBuyPickerValueChange: function(value) {
    this.setState({selectedBuyCurrency: value});
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

    //For CurrencyPicker
    var sellPick = this.state.selectedSellCurrency;
    var buyPick = this.state.selectedBuyCurrency;
    var dismiss = this.dismissPicker;
    var onPressSell = this.onPressSell;
    var onPressBuy = this.onPressBuy;

    var sellPicker = this.state.showSellCurrencyPicker ?
      (<CurrencyPicker
        currentCurrency={this.state.selectedSellCurrency}
        currencyList={currencyList}
        onPick={function(){
          next["Target"] = "Sell";
          next["Sell"] = sellPick;
          dismiss();
          subject.onNext(next);
        }}
        onPickerValueChange={this.onSellPickerValueChange}
        dismissPicker={this.dismissPicker} />) : null;

    var buyPicker = this.state.showBuyCurrencyPicker ?
      (<CurrencyPicker
        onPick={function(){
          next["Target"] = "Buy";
          next["Buy"] = buyPick;
          dismiss();
          subject.onNext(next);
        }}
        currentCurrency={this.state.selectedBuyCurrency}
        currencyList={currencyList}
        onPickerValueChange={this.onBuyPickerValueChange}
        dismissPicker={this.dismissPicker} />) : null;

    return (
      <View>
        <Text style={[this.props.cardCommonStyles.titles, {marginBottom: 5}]}>
          {this.props.data["TitleText"]}
        </Text>

        <Divider />
        <View style={{flexDirection: 'column', alignItems:'center'}}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.marginRight}
              onPress={function(event) {
                if (!canEditCurrency) return ;
                next["Target"] = "PressSell";
                subject.onNext(next);
                onPressSell();
              }}>
              <CurrencySelectText
                selected={this.state.showSellCurrencyPicker}
                iconStyle={this.props.cardCommonStyles.triangleIconStyle}
                text={sell}/>
            </TouchableOpacity>
            <CurrencyAmountTextInput
              textStyle={[this.props.cardCommonStyles.inputAmountText,
                  (this.props.data["SellRate"] ? styles.calculated : {}) ]}
              onChangeText={function(num){
                next["Target"] = "AmountSell";
                next["AmountSell"] = num;
                subject.onNext(next);
              }}
              onFocus={function() {
                next["Target"] = "Focus";
                subject.onNext(next);
              }}
              value={AmountSell + (this.props.data["SellRate"] ? "*": "")}
            />
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
            <TouchableOpacity
              style={styles.marginRight}
              onPress={function(event) {
              if (!canEditCurrency) return ;
              next["Target"] = "PressBuy";
              subject.onNext(next);
              onPressBuy();
            }}>
              <CurrencySelectText
                selected={this.state.showBuyCurrencyPicker}
                iconStyle={this.props.cardCommonStyles.triangleIconStyle}
                text={buy}/>
            </TouchableOpacity>
            <CurrencyAmountTextInput
              textStyle={[this.props.cardCommonStyles.inputAmountText,
                (this.props.data["BuyRate"] ? styles.calculated : {})
              ]}
              onChangeText={function(num){
                next["Target"] = "AmountBuy";
                next["AmountBuy"] = num;
                subject.onNext(next);
              }}
              onFocus={function() {
                next["Target"] = "Focus";
                subject.onNext(next);
              }}
              value={AmountBuy + (this.props.data["BuyRate"] ? "*": "")}
            />
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
        {sellPicker}
        {buyPicker}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 10,
  },
  marginRight: {
    marginRight: 10,
  },
  centerImage: {
    marginTop: 3,
    marginRight: 5,
    width: 20,
    height: 12,
    resizeMode: 'stretch',
    alignSelf: 'center'
  },
  calculated: {
    color: '#333333',
  },
});


module.exports = CurrencyAmountSelect;
