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

var ConversationsScreen = React.createClass({
  mixins: [ScreenMixin],
  displayName: "ConversationsScreen",
  endPoint: "user/conversation",
  getInitialState: function() {
    return {
      data: null,
    };
  },
  getConversation: function(event) {
    console.log(event);
  },
  renderScreen: function() {
    var cardObservers = { };
    cardObservers["UserConversationItem"] = this.getConversation;
    var listView = (<PlainListView
      cardObservers={cardObservers}
      cards={this.state.data["Cards"]}
      onEndReached={this.loadMore}
      />);

    return (
      <View style={this.screenCommonStyle.container}>
        {listView}
      </View>
    );
  }
});

module.exports = ConversationsScreen;
