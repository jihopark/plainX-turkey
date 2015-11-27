'use strict';

var React = require('react-native');

var {
  View,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');

var ActionButton = require('../ActionButton.js');

var OfferConfirmationScreen = React.createClass({
  mixins: [ScreenMixin],
  displayName: "OfferConfirmationScreen",
  endPoint: 'offer/confirm',
  getInitialState: function() {
    return {
      data: null,
    };
  },
  renderScreen: function() {
    return (
      <View style={this.screenCommonStyle.container}>
        <PlainListView
          cardObservers={{}}
          cards={this.state.data["Cards"]}/>
        <ActionButton
          text={"FINISH"}
          onPress={() => console.log("press")}
          enabled={true} />
      </View>
    );
  }
});


module.exports = OfferConfirmationScreen;
