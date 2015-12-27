'use strict';

var React = require('react-native');

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
var PlainActions = require('../../actions/PlainActions.js');

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
  onPickSellPicker: function(){
    this.dismissPicker();
    PlainActions.updateCardData(this.props.id, "Sell", this.state.selectedSellCurrency);
  },
  onPickBuyPicker: function(){
    this.dismissPicker();
    PlainActions.updateCardData(this.props.id, "Buy", this.state.selectedBuyCurrency);
  },
  onPressNextButton: function() {
    this.props.handleClick(this.props.name,
      {"Sell": this.props.data["Sell"], "Buy": this.props.data["Buy"]});
  },
  render: function() {
    var sellPicker = this.state.showSellCurrencyPicker ?
      (<CurrencyPicker
        currentCurrency={this.state.selectedSellCurrency}
        currencyList={this.props.data["CurrencyList"]}
        onPick={this.onPickSellPicker}
        onPickerValueChange={this.onSellPickerValueChange}
        dismissPicker={this.dismissPicker} />) : null;

    var buyPicker = this.state.showBuyCurrencyPicker ?
      (<CurrencyPicker
        onPick={this.onPickBuyPicker}
        currentCurrency={this.state.selectedBuyCurrency}
        currencyList={this.props.data["CurrencyList"]}
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
              selected={this.state.showSellCurrencyPicker}
              iconStyle={this.props.cardCommonStyles.triangleIconStyle}
              text={this.props.data["Sell"]}/>
          </TouchableOpacity>

          <Text style={this.props.cardCommonStyles.titles, styles.to}>
            TO
          </Text>

          <TouchableOpacity onPress={this.onPressBuy}>
            <CurrencySelectText
              selected={this.state.showBuyCurrencyPicker}
              iconStyle={this.props.cardCommonStyles.triangleIconStyle}
              text={this.props.data["Buy"]}/>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={this.onPressNextButton}>
          <CardButton text={"FIND OFFERS"} />
        </TouchableOpacity>
        {this.props.data["Buy"] != "HKD" && this.props.data["Sell"] != "HKD" ?
        (<Text style={[this.props.cardCommonStyles.headings, {marginTop: 10,}]}>
            {"*Your chances of match will be\nhigher if it involves Hong Kong Dollars."}
          </Text>)
         : null}
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
