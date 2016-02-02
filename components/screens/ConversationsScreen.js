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

var PlainLog = require('../../PlainLog.js');
var P = new PlainLog("ConversationsScreen");


class ConversationsScreen extends BaseScreen{
  constructor(props) {
    super(props);
    this.endPoint = "user/conversations";
    this.renderScreen = this.renderScreen.bind(this);
    this.trackName = "Conversations";
  }

  renderScreen() {
    var listView = this.createListViewPagination(true);

    return (
      <View style={this.screenCommonStyle.container}>
        {listView}
      </View>
    );
  }
}


module.exports = ConversationsScreen;
