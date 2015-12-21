'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  Text,
} = React;

var PlainListView = require('../PlainListView.js');
var BaseScreen = require('./BaseScreen.js');
var RestKit = require('react-native-rest-kit');
var ActionButton = require('../ActionButton.js');
var ShouldLoginAlert = require('../ShouldLoginAlert.js');
var ParameterUtils = require('../utils/ParameterUtils.js');

var update = require('react-addons-update');

var actionButtonStates = {"connected": "CONNECTED!",
                        "connecting": "Loading",
                        "not_connected": "CONNECT TO THIS OFFER",
                        "self": "REMOVE OFFER",
                        "error": "SOMETHING WENT WRONG"};

class OfferDetailScreen extends BaseScreen{
  constructor(props) {
    super(props);
    this.endPoint = 'offer/details';
    this.onConnectOffer = this.onConnectOffer.bind(this);
    this.handleConnectRequest = this.handleConnectRequest.bind(this);
    this.onRemoveOffer = this.onRemoveOffer.bind(this);
    this.handleRemoveRequest = this.handleRemoveRequest.bind(this);
    this.getOfferState = this.getOfferState.bind(this);
    this.setOfferState = this.setOfferState.bind(this);
    this.renderScreen = this.renderScreen.bind(this);
  }

  onConnectOffer() {
    console.log("CONNECT");
    const CONNECT_ENDPOINT = "offer/connect"
    var url = this.props.api_domain + CONNECT_ENDPOINT;
    var bodyParams = ParameterUtils.getStringToParams(this.props.params);
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
  }

  handleConnectRequest(error, json) {
    this.props.setNetworkActivityIndicator(false);
    if (error) {
      console.log(error);
      if (error.status == 401) {
        // TODO: Should not replace but push LoginScreen
        ShouldLoginAlert.showAlert("You need to login to connect to an offer",
          () => this.props.replaceScreen({uri: this.props.routes.addRoute('login')}));
        this.setOfferState("not_connected");
      }
      else
        this.setOfferState("error");
      return ;
    }
    if (json) {
      console.log("SUCCESS");
      this.setOfferState("connected");
      this.props.pushScreen({uri: this.props.routes.addRoute('conversationRoom?Id='+json["ConversationId"])});
    }
  }

  onRemoveOffer(){
    const DELETE_ENDPOINT = "offer";
    var url = this.props.api_domain + DELETE_ENDPOINT;
    var bodyParams = this.getStringToParams(this.props.params);
    console.log(url);

    var request = {
      method: 'delete',
      headers: {
        'X-Session': this.loginToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyParams),
    };
    this.props.setNetworkActivityIndicator(true);
    this.setOfferState("connecting");
    RestKit.send(url, request, this.handleRemoveRequest);
  }

  handleRemoveRequest(error, json) {
    this.props.setNetworkActivityIndicator(false);
    if (error) {
      console.log(error);
      this.setOfferState("error");
      return ;
    }
    if (json) {
      console.log("SUCCESS");
      console.log(json["ConversationId"]);
      this.props.popScreen();
    }
  }

  getOfferState() {
    var meta = this.state.data["Meta"];
    if (meta){
      if (meta["isOwnOffer"])
        return "self";
      if (meta["isConnected"]){
        return "connected";
      }
      else if (meta["error"])
          return "error";
      else if (meta["isOwnOffer"])
        return "self";
      else if (meta["isConnecting"])
          return "connecting";

    }
    return "not_connected";
  }

  // TODO : Offer State in Store
  setOfferState(value) {
    switch(value) {
      case "not_connected":
        var data = update(this.state.data, {"Meta": {"isConnecting": {$set:false}}});
        data = update(data, {"Meta": {"error": {$set:false}}});
        data = update(data, {"Meta": {"isConnecting": {$set:false}}});
        this.setState({data: data});
        break;
      case "connected":
        this.setState({data: update(this.state.data, {"Meta": {"isConnected": {$set:true}}})});
        break;
      case "error":
        this.setState({data: update(this.state.data, {"Meta": {"error": {$set:true}}})});
        break;
      case "connecting":
        this.setState({data: update(this.state.data, {"Meta": {"isConnecting": {$set:true}}})});
    }
  }

  renderScreen() {
    var cardObservers = { };
    var listView = (<PlainListView
      cardObservers={cardObservers}
      cards={this.state.data["Cards"]}
      onEndReached={this.loadMore}
      />);

    var isOwnOffer = this.state.data["Meta"] ? this.state.data["Meta"]["isOwnOffer"] : null;
    var makeOfferButton = (<ActionButton
                            text={actionButtonStates[this.getOfferState()]}
                            onPress={this.onConnectOffer}
                            enabled={this.getOfferState() == "not_connected"} />);
    var removeOfferButton = (<ActionButton
                            text={actionButtonStates[this.getOfferState()]}
                            onPress={this.onRemoveOffer}
                            backgroundColor={"#ee586e"}
                            enabled={true} />);
    return (
      <View style={this.screenCommonStyle.container}>
        {listView}
        {this.getOfferState() != "self" ? makeOfferButton : null}
      </View>
    );
  }
}

module.exports = OfferDetailScreen;
