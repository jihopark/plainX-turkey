'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  Platform,
  Text,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');
var OfferCardMixin = require('./cardMixins/OfferCardMixin.js');

var ActionButton = require('../ActionButton.js');

var OfferListScreen = React.createClass({
  mixins: [ScreenMixin, OfferCardMixin],
  displayName: "OfferListScreen",
  endPoint: "offer/list",
  getInitialState: function() {
    return {
      showActionButton: true,

      data: null
    };
  },
  onPress: function() {
    this.props.pushScreen({uri: this.props.routes.addRoute('makeOffer?'+this.props.params)});
  },
  renderScreen: function() {
    var cardObservers = { };
    cardObservers["Offer"] = this.offerCardonNext;

    var listView = (<PlainListView
      cardObservers={cardObservers}
      cards={this.state.data["Cards"]}/>);

    var makeOfferButton = (<ActionButton
      text={"Make Offer"} onPress={this.onPress} />);

    return (
      <View style={styles.container}>
        {listView}
        {this.state.showActionButton ? makeOfferButton : null}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  }
});



module.exports = OfferListScreen;
