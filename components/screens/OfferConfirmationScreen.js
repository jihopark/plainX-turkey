'use strict';

var React = require('react-native');

var {
  View,
} = React;

var BaseScreen = require('./BaseScreen.js');

var ParameterUtils = require('../utils/ParameterUtils.js');
var ActionButton = require('../ActionButton.js');
var RestKit = require('react-native-rest-kit');

var PlainLog = require('../../PlainLog.js');
var P = new PlainLog("OfferConfirmationScreen");


var actionButtonStates = { "default": "FINISH",
                        "loading": "Loading",
                        "done": "DONE!",
                        "error": "SOMETHING WENT WRONG"};


class OfferConfirmationScreen extends BaseScreen{
  constructor(props){
    super(props);
    this.endPoint = 'offer/confirm';
    this.state.buttonState = "default";
    this.submitOffer = this.submitOffer.bind(this);
    this.handleRequest = this.handleRequest.bind(this);
    this.renderScreen = this.renderScreen.bind(this);
  }

  submitOffer(){
    var url = this.props.api_domain + "offer";
    var params = ParameterUtils.getStringToParams(this.props.params);
    var request = {
      method: 'post',
      headers: {
        'X-Session': this.props.loginToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'},
      body: JSON.stringify(params),
    };
    P.log("submitOffer",params);
    this.props.setNetworkActivityIndicator(true);
    this.setState({buttonState:"loading"});
    RestKit.send(url, request, this.handleRequest);
  }

  handleRequest(error, json) {
    this.props.setNetworkActivityIndicator(false);
    if (error) {
      P.log("handleRequest/Error", error);
      this.setState({buttonState:"error"});
      return ;
    }
    if (json) {
      P.log("handleRequest/Success",json);
      this.setState({buttonState:"done"});
      var routes = [{uri: 'offerSubmitted'}];
      this.props.immediatelyResetRouteStack(routes);
    }
  }

  renderScreen() {
    var listView = this.createListView();
    return (
      <View style={this.screenCommonStyle.container}>
        {listView}
        <ActionButton
          text={actionButtonStates[this.state.buttonState]}
          onPress={this.submitOffer}
          enabled={true} />
      </View>
    );
  }
}


module.exports = OfferConfirmationScreen;
