'use strict';

var React = require('react-native');
var {
  AppRegistry,
  PushNotificationIOS,
  AppStateIOS,
} = React;

var AppContainer = require('./components/AppContainer.js');

var PlainLog = require('./PlainLog.js');
var P = new PlainLog("AppContainerIOS");
var SessionActions = require('./actions/SessionActions.js');

class AppContainerIOS extends AppContainer {
  constructor(){
    super();
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.onCheckPermission = this.onCheckPermission.bind(this);
    this.onNotification = this.onNotification.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    PushNotificationIOS.addEventListener("register", this.onRegister);
    PushNotificationIOS.checkPermissions(this.onCheckPermission);

  }

  componentWillUnmount() {
    super.componentWillUnmount();
    PushNotificationIOS.removeEventListener('notification', this.onNotification);
    PushNotificationIOS.removeEventListener("register", this.onRegister);
  }

  onCheckPermission(permission) {
    P.log("onCheckPermission", "Permission alert:" + permission.alert + " badge:" + permission.badge + " sound:" + permission.sound);
    if (!permission.alert) {
      P.log("onCheckPermission", "REQUESTING PERMISSION BECAUSE U DON'T HAVE ONE");
      PushNotificationIOS.requestPermissions();
    }
    PushNotificationIOS.addEventListener("notification", this.onNotification);
  }

  onNotification(event) {
    P.log("onNotification", event);

    var state = AppStateIOS.currentState;
    if (state!='active' && event["_data"]["uri"]){
      SessionActions.updateUri(event["_data"]["uri"]);
    }
    else{
      this.updateMessageCount();
    }
  }
}

AppRegistry.registerComponent('plainX', () => AppContainerIOS);
