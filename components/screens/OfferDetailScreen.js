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
var RestKit = require('react-native-rest-kit');
var ActionButton = require('../ActionButton.js');

var actionButtonStates = {"connected": "CONNECTED!",
                        "connecting": "Loading",
                        "not_connected": "CONNECT TO THIS OFFER",
                        "self": "self",
                        "error": "SOMETHING WENT WRONG"};

var OfferDetailScreen = React.createClass({
  mixins: [ScreenMixin],
  displayName: "OfferDetailScreen",
  endPoint: "offer/details",
  getInitialState: function() {
    return {
      actionButtonState: "not_connected",
      data: null
    };
  },
  onConnectOffer: function() {
    console.log("CONNECT");
    const CONNECT_ENDPOINT = "offer/connect"
    var url = this.props.api_domain + CONNECT_ENDPOINT;
    var bodyParams = this.getStringToParams(this.props.params);
    console.log(url);
    console.log(JSON.stringify(bodyParams));

    var request = {
      method: 'post',
      headers: {
        'X-Session': this.loginToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyParams),
    };
    this.props.setNetworkActivityIndicator(true);
    this.setState({actionButtonState: "connecting"});
    RestKit.send(url, request, this.handleConnectRequest);
  },
  handleConnectRequest: function(error, json) {
    this.props.setNetworkActivityIndicator(false);
    if (error) {
      console.log(error);
      this.setState({actionButtonState: "error"});
      if (error.status == 500 || error.status == 404) {

      }
      return ;
    }
    if (json) {
      console.log("SUCCESS");
      console.log(json);
      this.setState({actionButtonState: "connected"});
    }
  },
  renderScreen: function() {
    var cardObservers = { };

    var listView = (<PlainListView
      cardObservers={cardObservers}
      cards={this.state.data["Cards"]}
      onEndReached={this.loadMore}
      />);

    var makeOfferButton = (<ActionButton
                            text={actionButtonStates[this.state.actionButtonState]}
                            onPress={this.onConnectOffer}
                            enabled={this.state.actionButtonState == "not_connected"} />);

    return (
      <View style={this.screenCommonStyle.container}>
        {listView}
        {this.state.actionButtonState != "self" ? makeOfferButton : null}
      </View>
    );
  }
});

module.exports = OfferDetailScreen;
