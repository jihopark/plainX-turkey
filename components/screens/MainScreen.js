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
    this.state.showTutorial= false;
    this.checkIfFirstExec = this.checkIfFirstExec.bind(this);
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.pushConversationsScreen = this.pushConversationsScreen.bind(this);
    this.closeTutorial = this.closeTutorial.bind(this);
    this.renderScreen = this.renderScreen.bind(this);
  }

  async checkIfFirstExec(){
    try {
      var keys = await AsyncStorage.getAllKeys();
      if (keys.indexOf("FIRST_LOGIN") == -1) {
        await AsyncStorage.setItem("FIRST_LOGIN", "false");
        return true;
      }
      else
        return false;
    } catch (error) {
      P.log("checkIfFirstExec", "Error Retreving checkIfFirstLogin");
      return false;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState["data"] && nextState["showTutorial"] == false) {
      this.checkIfFirstExec().then((isFirstExec) => {
        if (isFirstExec) {
          this.setState({showTutorial: true});
        }
      }).done();
    }
    return true;
  }

  pushConversationsScreen(event) {
    this.props.pushScreen({uri: this.props.routes.addRoute('conversations')});
  }

  closeTutorial() {
    this.setState({showTutorial: false});
  }

  renderScreen() {
    this.props.leftNavBarButtonSubject.subscribe(this.toggleSideMenu);
    this.props.rightNavBarButtonSubject.subscribe(this.pushConversationsScreen);

    var listView = this.createListView();

    return (
      <View style={this.screenCommonStyle.container}>
        {(this.state.data["Meta"] && this.state.data["Meta"]["tutorialUrls"] && this.state.showTutorial) ?
          (<TutorialPager
            closeTutorial={this.closeTutorial}
            urls={this.state.data["Meta"]["tutorialUrls"]} />) :
          listView}
      </View>
    );
  }
}

module.exports = MainScreen;
