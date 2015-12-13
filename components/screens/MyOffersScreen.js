'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
} = React;

var PlainListView = require('../PlainListView.js');

var ScreenMixin = require('./componentMixins/ScreenMixin.js');
var OfferCardMixin = require('./cardMixins/OfferCardMixin.js');

var ActionButton = require('../ActionButton.js');

var MyOffersScreen = React.createClass({
  mixins: [ScreenMixin, OfferCardMixin],
  displayName: "MyOffersScreen",
  endPoint: "user/offers",
  getInitialState: function() {
    return {
      data: null
    };
  },
  onPress: function() {
    this.props.pushScreen({uri: this.props.routes.addRoute('makeOffer?')});
  },
  renderScreen: function() {
    var cardObservers = { };
    cardObservers["Offer"] = this.offerCardonNext;

    return (
      <View style={this.screenCommonStyle.container}>
        <PlainListView
          cardObservers={cardObservers}
          cards={this.state.data["Cards"]}
          onEndReached={this.loadMore}
          />
        <ActionButton
          text={"ADD NEW OFFER"}
          onPress={this.onPress}
          enabled={true} />
      </View>
    );
  }
});

module.exports = MyOffersScreen;
