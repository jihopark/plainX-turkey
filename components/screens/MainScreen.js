'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  AsyncStorage,
  AppStateIOS,
} = React;

var Routes = require('../screens/Routes.js');
var BaseScreen = require('./BaseScreen.js');

var TutorialPager = require('../TutorialPager.js');
var PlainListView = require('../PlainListView.js');

var PlainLog = require('../../PlainLog.js');
var P = new PlainLog("MainScreen");

var ActivityAndroid = require('react-native-activity-android');


class MainScreen extends BaseScreen{
  constructor(props) {
    super(props);
    this.endPoint = "main";
    this.pushConversationsScreen = this.pushConversationsScreen.bind(this);
    this.renderScreen = this.renderScreen.bind(this);
    this.handleActivityPause = this.handleActivityPause.bind(this);
    this.handleActivityResume = this.handleActivityResume.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.trackName = "Main";
    this.appState = 'active';
  }

  componentDidMount() {
    super.componentDidMount();
    if (Platform.OS == 'ios')
      AppStateIOS.addEventListener('change', this.handleAppStateChange);
    else{
      ActivityAndroid.addEventListener('activityPause', this.handleActivityPause);
      ActivityAndroid.addEventListener('activityResume', this.handleActivityResume);
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (Platform.OS == 'ios')
      AppStateIOS.removeEventListener('change', this.handleAppStateChange);
    else{
      ActivityAndroid.removeEventListener('activityPause', this.handleActivityPause);
      ActivityAndroid.removeEventListener('activityResume', this.handleActivityResume);
    }
  }

  handleActivityPause(){
    P.log("handleActivityPause", "inactive");
    this.handleAppStateChange('inactive');
  }

  handleActivityResume(){
    P.log("handleActivityResume", "active");
    this.handleAppStateChange('active');
  }

  handleAppStateChange(appState) {
    if (this.appState != appState) {
      this.appState = appState;
      if (appState == 'active') {
        this.setState({data:null});
        this.loadScreen();
      }
    }
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
