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
var CurrencyAmountSelectCardMixin = require('./cardMixins/CurrencyAmountSelectCardMixin.js');
var LocationSelectCardMixin = require('./cardMixins/LocationSelectCardMixin.js');
var ExpiryDateSelectCardMixin = require('./cardMixins/ExpiryDateSelectCardMixin.js');

var ActionButton = require('../ActionButton.js');

var MakeOfferScreen = React.createClass({
  mixins: [ScreenMixin, CurrencyAmountSelectCardMixin, ExpiryDateSelectCardMixin, LocationSelectCardMixin],
  displayName: "MakeOfferScreen",
  endPoint: 'offer/make',
  getInitialState: function() {
    return {
      data: null,
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
      else if (cards[i]["Name"] == "ExpiryDateSelect") {
        params["Date"] = cards[i]["Data"]["Date"];
      }
    }
    return locationInputValid && amountInputValid && currencyInputValid ? params : null;
  },
  renderScreen: function() {
    var cardObservers = { };
    cardObservers["Offer"] = this.offerCardonNext;
    cardObservers["CurrencyAmountSelect"] = this.currencyAmountSelectCardOnNext;
    cardObservers["ExpiryDateSelect"] = this.expiryDateSelectCardonNext;
    cardObservers["LocationSelect"] = this.locationSelectonNext;

    var requestParams = this.getRequestParams();

    var listView = (<PlainListView
      cardObservers={cardObservers}
      cards={this.state.data["Cards"]}/>);

    var finishButton = (<ActionButton
      text={"NEXT"}
      onPress={function(){
        this.props.pushScreen({uri: this.props.routes.addRoute('offerConfirm?'+this.getParamsToString(requestParams))});
      }}
      enabled={requestParams!=null} />);

    return (
      <View style={this.screenCommonStyle.container}>
        {listView}
        {finishButton}
      </View>
    );
  }
});


module.exports = MakeOfferScreen;
