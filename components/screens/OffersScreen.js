'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  Platform,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');
var CurrencyPickerMixin = require('./componentMixins/CurrencyPickerMixin.js');
var CurrencyAmountSelectCardMixin = require('./cardMixins/CurrencyAmountSelectCardMixin.js');
var ExpiryDateSelectCardMixin = require('./cardMixins/ExpiryDateSelectCardMixin.js');
var CurrencyPicker = (Platform.OS === 'ios') ? require('../CurrencyPicker.ios.js') : require('../CurrencyPicker.android.js');

var OffersScreen = React.createClass({
  mixins: [ScreenMixin, CurrencyPickerMixin, CurrencyAmountSelectCardMixin, ExpiryDateSelectCardMixin],
  displayName: "OffersScreen",
  getInitialState: function() {
    return {
      showCurrencyPicker: false,
      currencyList: [],
      targetInput: null,
      currencySelectId: null,
      currentCurrency: null,
      data: {
        "Cards": [
          {
            "Name": "Explanation",
            "UUID": 0,
            "Data": {
              "Text": "This is OffersList"
            }
          },
          {
            "Name": "CurrencyAmountSelect",
            "UUID": 5,
            "Data": {
              "Sell":"USD",
              "Buy":"HKD",
              "SellAmount": "0",
              "BuyAmount": "0",
              "CurrencyList":[{"Country":"Afghanistan","Code":"AFN"},{"Country":"China","Code":"CNY"},{"Country":"Hong Kong","Code":"HKD"},{"Country":"United States","Code":"USD"}]
            }
          },
          {
            "Name": "ExpiryDateSelect",
            "UUID": 1,
            "Data": {
              "Date": "2015-11-18"
            }
          },
          {
            "Name": "Offer",
            "UUID": 2,
            "Data": {
            }
          }
        ]
      }
    };
  },
  fetchData: function() {

  },
  render: function() {
    if (this.state.data) {
      var cardObservers = { };
      cardObservers["Offer"] = (input) => console.log("Clicked Offer Card with id of "+input);
      cardObservers["CurrencyAmountSelect"] = this.currencyAmountSelectCardOnNext;
      cardObservers["ExpiryDateSelect"] = this.expiryDateSelectCardonNext;

      var listView = (<PlainListView
        cardObservers={cardObservers}
        cards={this.state.data["Cards"]}/>);

      if (this.state.showCurrencyPicker) {
        var currencyPicker = (
          <CurrencyPicker
            currentCurrency={this.state.currentCurrency}
            currencyList={this.state.currencyList}
            onPickerValueChange={this.onPickerValueChange}
            dismissPicker={this.dismissPicker} />);

        return (
          <View style={styles.container}>
            {listView}
            {currencyPicker}
          </View>
        );
      }
      return (
        <View style={styles.container}>
          {listView}
        </View>
      );
    }
  }
});

var styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  }
});



module.exports = OffersScreen;
