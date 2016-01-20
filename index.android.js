'use strict';

var React = require('react-native');
var {
  AppRegistry,
} = React;

var AppContainer = require('./components/AppContainer.js');

var PlainLog = require('./PlainLog.js');
var P = new PlainLog("AppContainerAndroid");

var SessionActions = require('./actions/SessionActions.js');

var ParsePush = require('./ParsePush');

class AppContainerAndroid extends AppContainer {
  constructor(){
    super();
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.onNotification = this.onNotification.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    ParsePush.addEventListener(ParsePush.REGISTER, this.onRegister);
    ParsePush.addEventListener(ParsePush.NOTIFICATION, this.onNotification);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    ParsePush.removeEventListener(ParsePush.REGISTER);
    ParsePush.removeEventListener(ParsePush.NOTIFICATION);
  }

  onNotification(isApplicationActive, event){
    var data = JSON.parse(event);

    P.log("onNotification", isApplicationActive);
    P.log("onNotification", data);
    if (isApplicationActive == ParsePush.ACTIVE) {
      this.updateMessageCount();
    }
    else {
      if (data["uri"]){
        P.log("onNotification", "Follow URI " + data["uri"]);
        SessionActions.updateUri(data["uri"]);
      }
    }
  }
}

AppRegistry.registerComponent('plainX', () => AppContainerAndroid);
