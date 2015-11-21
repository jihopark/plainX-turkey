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

var CurrencyPicker = (Platform.OS === 'ios') ? require('../CurrencyPicker.ios.js') : require('../CurrencyPicker.android.js');
var ActionButton = require('../ActionButton.js');

var MakeOfferScreen = React.createClass({
  mixins: [ScreenMixin, CurrencyPickerMixin, CurrencyAmountSelectCardMixin, ExpiryDateSelectCardMixin, LocationSelectCardMixin],
  displayName: "MakeOfferScreen",
  endPoint: 'offer/make',
  getInitialState: function() {
    return {
      showCurrencyPicker: false,
      currencyList: [],
      targetInput: null,
      currencySelectId: null,
      currentCurrency: null,
    };
  },
  getRequestParams: function() {
    var locationInputValid = false;
    var amountInputValid = false;
    var currencyInputValid = false;
    var params = {};

    var cards = this.state.data["Cards"];
    for (var i=0, numCards = cards.length ; i<numCards; i++) {
      if (cards[i]["Name"] == "CurrencyAmountSelect") {
        currencyInputValid = cards[i]["Data"]["Sell"] != cards[i]["Data"]["Buy"];
        amountInputValid = cards[i]["Data"]["AmountSell"]!='' && cards[i]["Data"]["AmountSell"]!='0' &&
                      cards[i]["Data"]["AmountBuy"]!='' && cards[i]["Data"]["AmountBuy"]!='0'
        params["Buy"] = cards[i]["Data"]["Buy"];
        params["Sell"] = cards[i]["Data"]["Sell"];
        params["AmountSell"] = cards[i]["Data"]["AmountSell"];
        params["AmountBuy"] = cards[i]["Data"]["AmountBuy"];
      }
      else if (cards[i]["Name"] == "LocationSelect") {
        for (var location in cards[i]["Data"]["Locations"]) {
          if (cards[i]["Data"]["Locations"][location]["IsSelected"]) {
            locationInputValid = true;
            params["Locations"] = params["Locations"] || [];
            params["Locations"].push(location);
          }
        }
      }
    }
    return locationInputValid && amountInputValid && currencyInputValid ? params : null;
  },
  onPress: function() {
    console.log("PRESS");
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

    var requestParams = this.getRequestParams();
    var finishButton = (<ActionButton
      text={"Finish"}
      onPress={this.onPress}
      enabled={requestParams!=null} />);
    console.log('Request Params:');
    console.log(requestParams);

    return (
      <View style={styles.container}>
        {listView}
        {this.state.showCurrencyPicker ? (
            <CurrencyPicker
              currentCurrency={this.state.currentCurrency}
              currencyList={this.state.currencyList}
              onPickerValueChange={this.onPickerValueChange}
              dismissPicker={this.dismissPicker} />)
          : finishButton}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  }
});



module.exports = MakeOfferScreen;
