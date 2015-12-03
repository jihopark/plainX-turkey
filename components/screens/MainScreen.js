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

var TutorialPager = require('../TutorialPager.js');
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
  pushConversationsScreen: function(event) {
    this.props.pushScreen({uri: this.props.routes.addRoute('conversations')});
  },
  renderScreen: function() {
    this.props.rightNavBarButtonSubject.subscribe(this.pushConversationsScreen);

    var cardObservers = { }
    cardObservers["CurrencySelect"] = this.currencySelectCardOnNext;
    cardObservers["Offer"] = this.offerCardonNext;

    var listView = (
      <PlainListView
        cardObservers={cardObservers}
        cards={this.state.data["Cards"]}/>);

    return (
      <View style={this.screenCommonStyle.container}>
        {(this.props.metaData && this.props.metaData["showTutorial"]) ?
          (<TutorialPager
            urls={{}} />) : //this.props.metaData["tutorialURLs"]
          listView}
      </View>
    );
  }
});

module.exports = MainScreen;
