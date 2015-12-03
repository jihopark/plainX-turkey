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

var ConversationRoomScreen = React.createClass({
  mixins: [ScreenMixin],
  displayName: "ConversationRoomScreen",
  endPoint: "conversation",
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
      onEndReached={this.loadMore}
      />);

    return (
      <View style={this.screenCommonStyle.container}>
        {listView}
      </View>
    );
  }
});

module.exports = ConversationRoomScreen;
