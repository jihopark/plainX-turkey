'use strict';

var React = require('react-native');
var {
  AppRegistry,
  PushNotificationIOS,
  AppStateIOS,
  Navigator,
  AsyncStorage,
} = React;

var PlainNavigator = require('./components/PlainNavigator.js');

var API_DOMAIN = require('./constants/BuildConstants').API_DOMAIN;
var RestKit = require('react-native-rest-kit');
var SessionStore = require('./stores/SessionStore.js');
var SessionActions = require('./actions/SessionActions.js');

var PlainLog = require('./PlainLog.js');
var P = new PlainLog("AppContainer");

var AppContainer = React.createClass({
  getInitialState: function() {
    return SessionStore.getState();
  },

  componentDidMount: function() {
    SessionStore.listen(this.onChange);
    PushNotificationIOS.addEventListener("register", this.onRegister);
    PushNotificationIOS.addEventListener('error', this.onError);
    PushNotificationIOS.checkPermissions(this.onCheckPermission);
    this.loadLoginTokenIfAny().then(
      (value) => {
        SessionActions.updateLoginToken(value);
        SessionActions.updateUser(value);
      }
    ).done();
    this.loadDeviceTokenIfAny().then(
      (value) => SessionActions.updateDeviceToken(value)
    ).done();
  },

  componentWillUnmount: function() {
    SessionStore.unlisten(this.onChange);
    PushNotificationIOS.removeEventListener('notification', this.onNotification);
    PushNotificationIOS.removeEventListener("register", this.onRegister);
    PushNotificationIOS.removeEventListener('error', this.onError);
  },

  onChange: function(state) {
    this.setState(state);
  },

  async loadLoginTokenIfAny(){
    try {
      var value = await AsyncStorage.getItem("SESSION");
      if (value == null) return "";
      return value;
    } catch (error) {
      return "";
    }
  },

  async loadDeviceTokenIfAny() {
    try {
      var value = await AsyncStorage.getItem("DEVICE_TOKEN");
      if (value == null) return "";
      return value;
    } catch (error) {
      return "";
    }
  },

  onCheckPermission: function(permission) {
    P.log("onCheckPermission", "Permission alert:" + permission.alert + " badge:" + permission.badge + " sound:" + permission.sound);
    if (!permission.alert) {
      P.log("onCheckPermission", "REQUESTING PERMISSION BECAUSE U DON'T HAVE ONE");
      PushNotificationIOS.requestPermissions();
    }
    PushNotificationIOS.addEventListener("notification", this.onNotification);
  },

  onNotification: function(event) {
    P.log("onNotification", event);

    var state = AppStateIOS.currentState;
    if (state!='active' && event["_data"]["uri"]){
      SessionActions.updateUri(event["_data"]["uri"]);
    }
    else{
      this.updateMessageCount();
    }
  },

  onRegister: function(deviceToken) {
    P.log("onRegister", deviceToken);
    //  PushNotificationIOS.setApplicationIconBadgeNumber(0);
    this.saveDeviceToken(deviceToken).then(this.sendDeviceToken).done();
  },

  async saveDeviceToken(token) {
    try {
      await AsyncStorage.setItem("DEVICE_TOKEN", token);
    } catch (error) {
      P.log("saveDeviceToken", error);
    }
    return token;
  },

  sendDeviceToken: function(deviceToken) {
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
  },

  updateMessageCount: function() {
    if (this.state.loginToken == null) return ;
    var request = {
      method: 'get',
      headers:{ 'X-Session': this.state.loginToken }
    };
    var unread_url = API_DOMAIN + "user/unreadmsgs";
    RestKit.send(unread_url, request, this.handleMessageCount);
  },

  handleMessageCount: function(error, json) {
    //TODO : Need to Test
    if (error) {
      P.log("handleMessageCount", error)
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
  },

  onError: function(message, key){
    P.log("onError", 'An error occurred from PushNotificationIOS with msg ' + message);
  },

  render: function() {
    return (this.state.loginToken != null
        && this.state.deviceToken !=null) ?
      (
        <PlainNavigator
          API_DOMAIN={API_DOMAIN}
          loginToken={this.state.loginToken}
          deviceToken={this.state.deviceToken}
          messageCount={this.state.messageCount}
          updateMessageCount={this.updateMessageCount}
          uri={this.state.uri}
          />
      )
      :
      null;
  }
});
AppRegistry.registerComponent('plainX', () => AppContainer);
