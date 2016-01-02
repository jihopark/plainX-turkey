'use strict';

var React = require('react-native');
var CurrencySelectText = require('../CurrencySelectText.js');
var Divider = require('../Divider.js');
var CurrencyAmountTextInput = require('../CurrencyAmountTextInput.js');

var PlainActions = require('../../actions/PlainActions.js');

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


function roundUpNumber(number) {
  return ""+(Math.round(number*100)/100);
}

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
  clearAllValues: function(){
    var keySet = ["AmountSell", "AmountBuy", "SellRate", "BuyRate"];
    var valueSet = ["","","",""];
    PlainActions.updateCardData(this.props.id, keySet, valueSet);
  },
  onPressSell: function(event) {
    this.clearAllValues();
    this.setState({showBuyCurrencyPicker: false, showSellCurrencyPicker: true, selectedSellCurrency: this.props.data["Sell"]});
  },
  onPressBuy: function(event) {
    this.clearAllValues();
    this.setState({showSellCurrencyPicker: false, showBuyCurrencyPicker: true, selectedBuyCurrency: this.props.data["Buy"]});
  },
  onSellPickerValueChange: function(value) {
    this.setState({selectedSellCurrency: value});
  },
  onBuyPickerValueChange: function(value) {
    this.setState({selectedBuyCurrency: value});
  },
  onPickSellPicker: function(){
    this.dismissPicker();
    PlainActions.updateCardData(this.props.id, "Sell", this.state.selectedSellCurrency);
  },
  onPickBuyPicker: function(){
    this.dismissPicker();
    PlainActions.updateCardData(this.props.id, "Buy", this.state.selectedBuyCurrency);
  },
  onFocusTextInput: function() {
    this.dismissPicker();
  },
  onChangeTextSell: function(num){
    if (!num)
      this.clearAllValues();
    else{
      var rate = this.getRateFromCurrencyList();
      var keySet = ["AmountSell", "AmountBuy", "BuyRate", "SellRate"];
      var valueSet = [num, roundUpNumber(num/rate), roundUpNumber((1/rate)), ""];
      PlainActions.updateCardData(this.props.id, keySet, valueSet);
    }
  },
  onChangeTextBuy: function(num){
    if (!num)
      this.clearAllValues();
    else{
      var rate = this.getRateFromCurrencyList();
      var keySet = ["AmountBuy", "AmountSell", "SellRate", "BuyRate"];
      var valueSet = [num, roundUpNumber(num*rate), roundUpNumber((rate)), ""];
      PlainActions.updateCardData(this.props.id, keySet, valueSet);
    }
  },
  getRateFromCurrencyList() {
    var sell = this.props.data["Sell"];
    var buy = this.props.data["Buy"];

    var rate = 1;
    var list = this.props.data["CurrencyList"];
    for (var j=0, numCurr = list.length; j< numCurr; j++) {
      if (list[j]["Code"] == sell)
        rate *= list[j]["Rate"];
      else if (list[j]["Code"] == buy)
        rate /= list[j]["Rate"];
    }
    return rate;
  },
  render: function() {
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
        onPick={this.onPickSellPicker}
        onPickerValueChange={this.onSellPickerValueChange}
        dismissPicker={this.dismissPicker} />) : null;

    var buyPicker = this.state.showBuyCurrencyPicker ?
      (<CurrencyPicker
        onPick={this.onPickBuyPicker}
        currentCurrency={this.state.selectedBuyCurrency}
        currencyList={currencyList}
        onPickerValueChange={this.onBuyPickerValueChange}
        dismissPicker={this.dismissPicker} />) : null;
    var dismissPicker = this.dismissPicker;

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
              onPress={this.onPressSell}>
              <CurrencySelectText
                selected={this.state.showSellCurrencyPicker}
                iconStyle={this.props.cardCommonStyles.triangleIconStyle}
                text={sell}/>
            </TouchableOpacity>
            <CurrencyAmountTextInput
              textStyle={[this.props.cardCommonStyles.inputAmountText,
                  (this.props.data["SellRate"] ? styles.calculated : {}) ]}
              onChangeText={this.onChangeTextSell}
              onFocus={this.onFocusTextInput}
              value={AmountSell}
              isCalculated={this.props.data["SellRate"]}
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
              onPress={this.onPressBuy}>
              <CurrencySelectText
                selected={this.state.showBuyCurrencyPicker}
                iconStyle={this.props.cardCommonStyles.triangleIconStyle}
                text={buy}/>
            </TouchableOpacity>
            <CurrencyAmountTextInput
              textStyle={[this.props.cardCommonStyles.inputAmountText,
                (this.props.data["BuyRate"] ? styles.calculated : {})
              ]}
              onChangeText={this.onChangeTextBuy}
              onFocus={this.onFocusTextInput}
              value={AmountBuy}
              isCalculated={this.props.data["BuyRate"]}
            />
          </View>
          <View style={styles.row}>
            {this.getDynamicRateExplanation(this.props.data["BuyRate"])}
          </View>
        </View>
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
