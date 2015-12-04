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
var update = require('react-addons-update');

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
      data: null
    };
  },
  onConnectOffer: function() {
    console.log("CONNECT");
    const CONNECT_ENDPOINT = "offer/connect"
    var url = this.props.api_domain + CONNECT_ENDPOINT;
    var bodyParams = this.getStringToParams(this.props.params);
    console.log(url);
    console.log("LOGINTOKEN");
    console.log(this.loginToken);

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
    this.setOfferState("connecting");
    RestKit.send(url, request, this.handleConnectRequest);
  },
  handleConnectRequest: function(error, json) {
    this.props.setNetworkActivityIndicator(false);
    if (error) {
      console.log(error);
      console.log("ERROR");
      this.setOfferState("error");
      return ;
    }
    if (json) {
      console.log("SUCCESS");
      console.log(json["ConversationId"]);
      this.setOfferState("connected");
    }
  },
  getOfferState: function() {
    var meta = this.state.data["Meta"];
    if (meta){
      if (meta["isConnected"]){
        return "connected";
      }
      else if (meta["isOwnOffer"])
        return "self";
      else if (meta["isConnecting"])
          return "connecting";
      else if (meta["error"])
        return "error";
    }
    return "not_connected";
  },
  setOfferState: function(value) {
    switch(value) {
      case "connected":
        this.setState({data: update(this.state.data, {"Meta": {"isConnected": {$set:true}}})});
        break;
      case "error":
        this.setState({data: update(this.state.data, {"Meta": {"error": {$set:true}}})});
        break;
      case "connecting":
        this.setState({data: update(this.state.data, {"Meta": {"isConnecting": {$set:true}}})});
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
                            text={actionButtonStates[this.getOfferState()]}
                            onPress={this.onConnectOffer}
                            enabled={this.getOfferState() == "not_connected"} />);

    return (
      <View style={this.screenCommonStyle.container}>
        {listView}
        {this.getOfferState() != "self" ? makeOfferButton : null}
      </View>
    );
  }
});

module.exports = OfferDetailScreen;
