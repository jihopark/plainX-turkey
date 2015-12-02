'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} = React;

var Routes = require('../screens/Routes.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');
var CurrencySelectCardMixin = require('./cardMixins/CurrencySelectCardMixin.js');
var OfferCardMixin = require('./cardMixins/OfferCardMixin.js');

var PlainListView = require('../PlainListView.js');

var MainScreen = React.createClass({
  mixins: [ScreenMixin, CurrencySelectCardMixin, OfferCardMixin],
  displayName: "MainScreen",
  endPoint: "main",
  getInitialState: function() {
    return {
      data: null,
    }
  },
  subscribeToNavBarSubjects: (left, right) => {
    left.subscribe((x) => console.log(x));
    right.subscribe((x) => console.log(x));
  },
  renderScreen: function() {
    this.subscribeToNavBarSubjects(this.props.leftNavBarButtonSubject, this.props.rightNavBarButtonSubject);

    var cardObservers = { }
    cardObservers["CurrencySelect"] = this.currencySelectCardOnNext;
    cardObservers["Offer"] = this.offerCardonNext;

    var listView = (
      <PlainListView
        cardObservers={cardObservers}
        cards={this.state.data["Cards"]}/>);

    return (
      <View style={this.screenCommonStyle.container}>
        {listView}
      </View>
    );
  }
});

module.exports = MainScreen;
