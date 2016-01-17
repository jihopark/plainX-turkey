'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  AsyncStorage,
} = React;

var Routes = require('../screens/Routes.js');
var BaseScreen = require('./BaseScreen.js');

var TutorialPager = require('../TutorialPager.js');
var PlainListView = require('../PlainListView.js');

var PlainLog = require('../../PlainLog.js');
var P = new PlainLog("MainScreen");


class MainScreen extends BaseScreen{
  constructor(props) {
    super(props);
    this.endPoint = "main";
    this.pushConversationsScreen = this.pushConversationsScreen.bind(this);
    this.renderScreen = this.renderScreen.bind(this);
    this.trackName = "Main";
  }

  pushConversationsScreen(event) {
    this.props.pushScreen({uri: this.props.routes.addRoute('conversations')});
  }

  renderScreen() {
    var listView = this.createListView();

    return (
      <View style={this.screenCommonStyle.container}>
        {listView}
      </View>
    );
  }
}

module.exports = MainScreen;
