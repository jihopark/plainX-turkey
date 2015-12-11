'use strict';

var React = require('react-native');

var {
  View,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');

var OfferSubmittedScreen = React.createClass({
  mixins: [ScreenMixin],
  displayName: "OfferSubmittedScreen",
  endPoint: "offer/submitted",
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
      </View>
    );
  }
});


module.exports = OfferSubmittedScreen;
