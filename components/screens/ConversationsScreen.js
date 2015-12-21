'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  Text,
} = React;

var PlainListView = require('../PlainListView.js');
var BaseScreen = require('./BaseScreen.js');
var ParameterUtils = require('../utils/ParameterUtils.js');

class ConversationsScreen extends BaseScreen{
  constructor(props) {
    super(props);
    this.endPoint = "user/conversations";
    this.getConversation = this.getConversation.bind(this);
    this.renderScreen = this.renderScreen.bind(this);
  }

  getConversation(event) {
    var params = {"Id": event["Id"], "Title": event["ScreenName"]};
    this.props.pushScreen({uri: this.props.routes.addRoute('conversationRoom?'+ParameterUtils.getParamsToString(params))});
  }

  renderScreen() {
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
}


module.exports = ConversationsScreen;
