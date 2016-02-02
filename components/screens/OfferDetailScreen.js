'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  Text,
} = React;

var BaseScreen = require('./BaseScreen.js');
var RestKit = require('react-native-rest-kit');
var ActionButton = require('../ActionButton.js');
var AlertUtils = require('../utils/AlertUtils.js');
var ParameterUtils = require('../utils/ParameterUtils.js');
var update = require('react-addons-update');
var PlainActions = require('../../actions/PlainActions.js');

var PlainLog = require('../../PlainLog.js');
var P = new PlainLog("OfferDetailScreen");


class OfferDetailScreen extends BaseScreen{
  constructor(props) {
    super(props);
    this.state.actionState = "not_connected";

    this.endPoint = 'offer/details';
    this.onConnectOffer = this.onConnectOffer.bind(this);
    this.handleConnectRequest = this.handleConnectRequest.bind(this);
    this.onPressRemoveOffer = this.onPressRemoveOffer.bind(this);
    this.onRemoveOffer = this.onRemoveOffer.bind(this);
    this.handleRemoveRequest = this.handleRemoveRequest.bind(this);
    this.renderScreen = this.renderScreen.bind(this);
    this.trackName = "OfferDetail";
  }

  onConnectOffer() {
    const CONNECT_ENDPOINT = "offer/connect"
    var url = this.props.api_domain + CONNECT_ENDPOINT;
    var bodyParams = ParameterUtils.getStringToParams(this.props.params);
    P.log("onConnectOffer", url);

    var request = {
      method: 'post',
      headers: {
        'X-Session': this.props.loginToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyParams),
    };
    this.props.setNetworkActivityIndicator(true);
    this.setState({actionState: "loading"});
    RestKit.send(url, request, this.handleConnectRequest);
  }

  handleConnectRequest(error, json) {
    this.props.setNetworkActivityIndicator(false);
    if (error) {
      P.log("handleConnectRequest/error", error);
      if (error.status == 401) {
        AlertUtils.showAlert(AlertUtils.LOGIN_CONNECT_OFFER,
          null,
          () => this.props.pushScreen({uri: this.props.routes.addRoute('login')}));
          this.setState({actionState: "not_connected"});
      }
      else if (error.status == 400) {
        var body = JSON.parse(error.body);
        P.log("handleConnectRequest",this.props.routes.addRoute('conversationRoom?Id='+ body["ConversationId"]));
        AlertUtils.showAlert(AlertUtils.CONNECTED_OFFER,
          null,
          () => this.props.pushScreen({uri: this.props.routes.addRoute('conversationRoom?Id='+ body["ConversationId"])}));
          this.setState({actionState: "connected"});
      }
      else
        this.setState({actionState: "error"});
      return ;
    }
    if (json) {
      P.log("handleConnectRequest/success", json);
      this.setState({actionState: "connected"});
      this.props.pushScreen({uri: this.props.routes.addRoute('conversationRoom?Id='+json["ConversationId"])});
    }
  }

  onPressRemoveOffer() {
    AlertUtils.showAlert(AlertUtils.REMOVE_OFFER,
      this.onRemoveOffer,
      null);
  }

  onRemoveOffer(){
    const DELETE_ENDPOINT = "offer";
    var url = this.props.api_domain + DELETE_ENDPOINT;
    var bodyParams = ParameterUtils.getStringToParams(this.props.params);
    P.log("onRemoveOffer", url);

    var request = {
      method: 'delete',
      headers: {
        'X-Session': this.props.loginToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyParams),
    };
    this.props.setNetworkActivityIndicator(true);
    this.setState({actionState: "loading"});
    RestKit.send(url, request, this.handleRemoveRequest);
  }

  handleRemoveRequest(error, json) {
    this.props.setNetworkActivityIndicator(false);
    if (error) {
      P.log("handleRemoveRequest/error", error);
      this.setOfferState("error");
      return ;
    }
    if (json) {
      var id = ParameterUtils.getStringToParams(this.props.params)["Id"];
      this.props.popScreen();
      PlainActions.removeOffer(id);
    }
  }


  renderScreen() {
    var listView = this.createListViewPagination(true);
    var offer = this.props.getOffer(this.state.data["Offers"][0]["Id"]);


    var isOwnOffer = this.props.user && this.props.user["Id"] == offer["SellerId"];
    P.log("renderScreen", "isOwnOffer" + isOwnOffer);

    var makeOfferButton = (<ActionButton
                            actionState={this.state.actionState}
                            onPress={this.onConnectOffer}
                            enabled={this.state.actionState != "loading"} />);
    var removeOfferButton = (<ActionButton
                            actionState={"self"}
                            onPress={this.onPressRemoveOffer}
                            backgroundColor={"#ee586e"}
                            enabled={true} />);
    return (
      <View style={this.screenCommonStyle.container}>
        {listView}
        {isOwnOffer ? removeOfferButton : makeOfferButton}
      </View>
    );
  }
}

module.exports = OfferDetailScreen;
