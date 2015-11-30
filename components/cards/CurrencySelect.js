'use strict';

var React = require('react-native');
var Rx = require('rx');

var {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} = React;

var CurrencySelectText = require('../CurrencySelectText.js');
var CardButton = require('../CardButton.js');
var CurrencyPicker = (Platform.OS === 'ios') ? require('../CurrencyPicker.ios.js') : require('../CurrencyPicker.android.js');

var CurrencySelect = React.createClass({
  displayName: "CurrencySelectCard",
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
    var sellPick = this.state.selectedSellCurrency;
    var buyPick = this.state.selectedBuyCurrency;
    var dismiss = this.dismissPicker;

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
        <Text style={[this.props.cardCommonStyles.titles, {marginBottom: 10,}]}>
          I WANT TO EXCHANGE
        </Text>

        <View style={styles.currencyContainer}>

          <TouchableOpacity onPress={this.onPressSell}>
            <CurrencySelectText
              iconStyle={this.props.cardCommonStyles.triangleIconStyle}
              text={sell}/>
          </TouchableOpacity>

          <Text style={this.props.cardCommonStyles.titles, styles.to}>
            TO
          </Text>

          <TouchableOpacity onPress={this.onPressBuy}>
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
        {sellPicker}
        {buyPicker}
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
