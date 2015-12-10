'use strict';

var React = require('react-native');

var {
  View,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');

var ActionButton = require('../ActionButton.js');
var RestKit = require('react-native-rest-kit');

var actionButtonStates = { "default": "FINISH",
                        "loading": "Loading",
                        "done": "DONE!",
                        "error": "SOMETHING WENT WRONG"};


var OfferConfirmationScreen = React.createClass({
  mixins: [ScreenMixin],
  displayName: "OfferConfirmationScreen",
  endPoint: 'offer/confirm',
  getInitialState: function() {
    return {
      buttonState: "default",
      data: null,
    };
  },
  submitOffer: function(){
    var url = this.props.api_domain + "offer";
    var params = this.getStringToParams(this.props.params);
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
  },
  handleRequest: function(error, json) {
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
      var routes = [{uri: 'main'}, {uri: 'main/offerSubmitted'}];
      this.props.immediatelyResetRouteStack(routes);
    }
  },
  renderScreen: function() {
    return (
      <View style={this.screenCommonStyle.container}>
        <PlainListView
          cardObservers={{}}
          cards={this.state.data["Cards"]}/>
        <ActionButton
          text={actionButtonStates[this.state.buttonState]}
          onPress={this.submitOffer}
          enabled={true} />
      </View>
    );
  }
});


module.exports = OfferConfirmationScreen;
