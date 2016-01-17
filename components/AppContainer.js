'use strict';

var React = require('react-native');
var {
  AsyncStorage,
} = React;

var PlainNavigator = require('./PlainNavigator.js');

var API_DOMAIN = require('../constants/BuildConstants').API_DOMAIN;
var RestKit = require('react-native-rest-kit');
var SessionStore = require('../stores/SessionStore.js');
var SessionActions = require('../actions/SessionActions.js');

var TutorialPager = require('./TutorialPager.js');

var MixpanelTracker = require('../MixpanelTracker.js');

var PlainLog = require('../PlainLog.js');
var P = new PlainLog("AppContainer");

class AppContainer extends React.Component{
  constructor(){
    super();
    this.state = SessionStore.getState();
    this.state.showTutorial= false;
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onChange = this.onChange.bind(this);
    this.loadLoginTokenIfAny = this.loadLoginTokenIfAny.bind(this);
    this.loadDeviceTokenIfAny = this.loadDeviceTokenIfAny.bind(this);
    this.saveDeviceToken = this.saveDeviceToken.bind(this);
    this.sendDeviceToken = this.sendDeviceToken.bind(this);
    this.updateMessageCount = this.updateMessageCount.bind(this);
    this.handleMessageCount = this.handleMessageCount.bind(this);
    this.render = this.render.bind(this);
    this.checkIfFirstExec = this.checkIfFirstExec.bind(this);
    this.closeTutorial = this.closeTutorial.bind(this);
    this.goToSignUp = this.goToSignUp.bind(this);
  }

  componentDidMount() {
    SessionStore.listen(this.onChange);
    this.loadLoginTokenIfAny().then(
      (value) => {
        SessionActions.updateLoginToken(value);
        SessionActions.updateUser(value);
      }
    ).done();
    this.loadDeviceTokenIfAny().then(
      (value) => SessionActions.updateDeviceToken(value)
    ).done();
    this.checkIfFirstExec().then((isFirstExec) => {
      if (isFirstExec) {
        MixpanelTracker.setProfile("");
        this.setState({showTutorial: true});
      }
    }).done();
  }

  componentWillUnmount() {
    SessionStore.unlisten(this.onChange);
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


  onChange(state) {
    this.setState(state);
  }

  async loadLoginTokenIfAny(){
    try {
      var value = await AsyncStorage.getItem("SESSION");
      if (value == null) return "";
      return value;
    } catch (error) {
      return "";
    }
  }

  async loadDeviceTokenIfAny() {
    try {
      var value = await AsyncStorage.getItem("DEVICE_TOKEN");
      if (value == null) return "";
      return value;
    } catch (error) {
      return "";
    }
  }

  async saveDeviceToken(token) {
    try {
      await AsyncStorage.setItem("DEVICE_TOKEN", token);
    } catch (error) {
      P.log("saveDeviceToken", error);
    }
    return token;
  }

  sendDeviceToken(deviceToken) {
    P.log("sendDeviceToken", "Saved DeviceToken " + token);
    SessionActions.updateDeviceToken(token);

    //TODO: Need to test with real device

    var request = {
      method: 'post',
      headers:{
        'X-Session': this.state.loginToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"Token": deviceToken}),
    };
    var url = API_DOMAIN + "user/token";
    RestKit.send(url, request, (error, json)=>
      {
        P.log("sendDeviceToken",error);
        P.log("sendDeviceToken", json);
      });
  }

  updateMessageCount() {
    if (this.state.loginToken == null) return ;
    var request = {
      method: 'get',
      headers:{ 'X-Session': this.state.loginToken }
    };
    var unread_url = API_DOMAIN + "user/unreadmsgs";
    RestKit.send(unread_url, request, this.handleMessageCount);
  }

  handleMessageCount(error, json) {
    //TODO : Need to Test
    if (error) {
      P.log("handleMessageCount", error);
      if (error.status == 401) {
        logOut(this.state.loginToken, this.state.deviceToken);
      }
      return ;
    }
    if (json) {
      var count = json["Count"];
      if (this.state.messageCount != count) {
        P.log("handleMessageCount", "Message Count is changed to" + count);
        SessionActions.updateMessageCount(count);
        PushNotificationIOS.setApplicationIconBadgeNumber(count);
      }
    }
  }

  closeTutorial(){
    this.setState({showTutorial: false});
  }

  goToSignUp() {
    this.setState({showTutorial: false, uri: "main/login/signup"});
    SessionActions.updateUri("main/login/signup");
  }

  render() {
    if (this.state.showTutorial) {
      return (<TutorialPager
                goToSignUp={this.goToSignUp}
                close={this.closeTutorial}/>);
    }
    else {
      return this.state.loginToken != null && this.state.deviceToken !=null ?
        (
          <PlainNavigator
            API_DOMAIN={API_DOMAIN}
            loginToken={this.state.loginToken}
            deviceToken={this.state.deviceToken}
            user={this.state.user}
            messageCount={this.state.messageCount}
            updateMessageCount={this.updateMessageCount}
            screenName={this.state.screenName}
            uri={this.state.uri}
            />
        )
        :
        null;
    }
  }
}

module.exports = AppContainer;
