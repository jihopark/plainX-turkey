'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  Text,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');

var ConversationsScreen = React.createClass({
  mixins: [ScreenMixin],
  displayName: "ConversationsScreen",
  endPoint: "user/conversations",
  getInitialState: function() {
    return {
      data: null,
    };
  },
  getConversation: function(event) {
    var params = {"id": event["Id"]};
    this.props.pushScreen({uri: this.props.routes.addRoute('conversationRoom?'+this.getParamsToString(params))});
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
