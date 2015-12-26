'use strict';

var React = require('react-native');

var {
  View,
} = React;

var PlainListView = require('../PlainListView.js');
var BaseScreen = require('./BaseScreen.js');

var ParameterUtils = require('../utils/ParameterUtils.js');
var ActionButton = require('../ActionButton.js');
var RestKit = require('react-native-rest-kit');

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
        'X-Session': this.loginToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'},
      body: JSON.stringify(params),
    };
    console.log(params);
    this.props.setNetworkActivityIndicator(true);
    this.setState({buttonState:"loading"});
    RestKit.send(url, request, this.handleRequest);
  }

  handleRequest(error, json) {
    this.props.setNetworkActivityIndicator(false);
    if (error) {
      console.log(error);
      console.log("ERROR");
      this.setState({buttonState:"error"});
      return ;
    }
    if (json) {
      console.log("SUCCESS"+json);
      this.setState({buttonState:"done"});
      var routes = [{uri: 'offerSubmitted'}];
      this.props.immediatelyResetRouteStack(routes);
    }
  }

  renderScreen() {
    var listView = createListView({});
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
