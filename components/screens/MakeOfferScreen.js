'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  Platform,
  Text,
  ScrollView,
} = React;

var PlainListView = require('../PlainListView.js');
var BaseScreen = require('./BaseScreen.js');
var ParameterUtils = require('../utils/ParameterUtils.js');
var ActionButton = require('../ActionButton.js');

class MakeOfferScreen extends BaseScreen{
  constructor(props) {
    super(props);
    this.endPoint = 'offer/make';
    this.getRequestParams = this.getRequestParams.bind(this);
    this.onPressNextButton = this.onPressNextButton.bind(this);
    this.renderScreen = this.renderScreen.bind(this);
  }

  getRequestParams() {
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
      else if (cards[i]["Name"] == "ExpirySelect") {
        params["Expiry"] = cards[i]["Data"]["Expiry"];
      }
    }
    return locationInputValid && amountInputValid && currencyInputValid ? params : null;
  }

  onPressNextButton() {
    this.props.pushScreen({uri: this.props.routes.addRoute('offerConfirm?'+ParameterUtils.getParamsToString(this.getRequestParams()))});
  }

  renderScreen() {
    var cardObservers = { };
    cardObservers["Offer"] = this.offerCardonNext;
    cardObservers["CurrencyAmountSelect"] = this.currencyAmountSelectCardOnNext;
    cardObservers["ExpirySelect"] = this.expirySelectCardonNext;
    cardObservers["LocationSelect"] = this.locationSelectonNext;

    var requestParams = this.getRequestParams();

    var listView = (<PlainListView
      cardObservers={cardObservers}
      cards={this.state.data["Cards"]}/>);

    var finishButton = (<ActionButton
      text={"NEXT"}
      onPress={this.onPressNextButton}
      enabled={requestParams!=null} />);

    return (
      <ScrollView contentContainerStyle={this.screenCommonStyle.container}>
        {listView}
        {finishButton}
      </ScrollView>
    );
  }
}


module.exports = MakeOfferScreen;
