'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  Text,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');

var GeneralCardsScreen = React.createClass({
  mixins: [ScreenMixin],
  displayName: "GeneralCardsScreen",
  getInitialState: function() {
    return {
      data: null,
    };
  },
  renderScreen: function() {
    var cardObservers = { };

    var listView = (<PlainListView
      cardObservers={cardObservers}
      cards={this.state.data["Cards"]}
      />);

    return (
      <View style={this.screenCommonStyle.container}>
        {listView}
      </View>
    );
  }
});

module.exports = GeneralCardsScreen;
