'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  Platform,
  Text,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');
var CurrencyPickerMixin = require('./componentMixins/CurrencyPickerMixin.js');
var CurrencyAmountSelectCardMixin = require('./cardMixins/CurrencyAmountSelectCardMixin.js');
var LocationSelectCardMixin = require('./cardMixins/LocationSelectCardMixin.js');
var ExpiryDateSelectCardMixin = require('./cardMixins/ExpiryDateSelectCardMixin.js');
var OfferCardMixin = require('./cardMixins/OfferCardMixin.js');
var CurrencyPicker = (Platform.OS === 'ios') ? require('../CurrencyPicker.ios.js') : require('../CurrencyPicker.android.js');

var OfferListScreen = React.createClass({
  mixins: [ScreenMixin, CurrencyPickerMixin, CurrencyAmountSelectCardMixin, ExpiryDateSelectCardMixin, LocationSelectCardMixin, OfferCardMixin],
  displayName: "OfferListScreen",
  endPoint: "offerlist",
  getInitialState: function() {
    return {
      showCurrencyPicker: false,
      currencyList: [],
      targetInput: null,
      currencySelectId: null,
      currentCurrency: null,
      data: null
    };
  },
  renderScreen: function() {
    var cardObservers = { };
    cardObservers["Offer"] = this.offerCardonNext;
    cardObservers["CurrencyAmountSelect"] = this.currencyAmountSelectCardOnNext;
    cardObservers["ExpiryDateSelect"] = this.expiryDateSelectCardonNext;
    cardObservers["LocationSelect"] = this.locationSelectonNext;

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
});

var styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  }
});



module.exports = OfferListScreen;
