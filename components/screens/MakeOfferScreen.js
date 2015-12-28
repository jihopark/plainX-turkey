'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  Platform,
  Text,
  ScrollView,
} = React;

var BaseScreen = require('./BaseScreen.js');
var ParameterUtils = require('../utils/ParameterUtils.js');
var ActionButton = require('../ActionButton.js');

var PlainLog = require('../../PlainLog.js');
var P = new PlainLog("MakeOfferScreen");


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
      var card = this.props.getCard(cards[i]["UUID"]);
      var data = card["Data"];
      switch (card["Name"]) {
        case "CurrencyAmountSelect":
          currencyInputValid = data["Sell"] != data["Buy"];
          amountInputValid = data["AmountSell"]!='' && data["AmountSell"]!='0' &&
                        data["AmountBuy"]!='' && data["AmountBuy"]!='0'
          params["Buy"] = data["Buy"];
          params["Sell"] = data["Sell"];
          params["AmountSell"] = data["AmountSell"];
          params["AmountBuy"] = data["AmountBuy"];
          break;
        case "LocationSelect":
          for (var location in data["Locations"]) {
            if (data["Locations"][location]["IsSelected"]) {
              locationInputValid = true;
              params["Locations"] = params["Locations"] || [];
              params["Locations"].push(location);
            }
          }
          break;
        case "ExpirySelect":
          params["Expiry"] = cards[i]["Data"]["Expiry"];
          break;
      }
    }
    P.log("getRequestParams", params);
    return locationInputValid && amountInputValid && currencyInputValid ? params : null;
  }

  onPressNextButton() {
    this.props.pushScreen({uri: this.props.routes.addRoute('offerConfirm?'+ParameterUtils.getParamsToString(this.getRequestParams()))});
  }

  renderScreen() {
    var requestParams = this.getRequestParams();

    var listView = this.createListView();


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
